// @flow

import EventEmitter from 'events'

import Process from './Process'

export type GroupOptions = {
	pathToConfig:string,
}

export default class Group {
	processes:Array<Process>
	sharedEnv:Env
	eventEmitter:EventEmitter

	constructor({ sharedEnv = {}, processes = [] }:GroupJSON = {}, { pathToConfig }:GroupOptions) {
		this.eventEmitter = new EventEmitter

		// Ensure that processes have unique names
		processes.forEach((x, idx) => {
			if(processes.findIndex(y => y.name === x.name) != idx) {
				throw new Error(`A process name must be unique. ${x.name} was used more than once.`)
			}
		})

		this.processes = processes.map((x) => {
			const p = new Process(x, { sharedEnv, pathToConfig })
			p.onStateChanged((state, data) => {
				this.eventEmitter.emit('state-changed', state, p.name, { data })
			})
			p.onMessageReceived((message, { channel }) => {
				this.eventEmitter.emit('message', message, p.name, { channel })
			})
			return p
		})
		this.sharedEnv = sharedEnv
	}

	startAll() {
		return Promise.all(this.processes.map(p => p.start()))
	}
	stopAll() {
		return Promise.all(this.processes.map(p => p.stop()))
	}

	onStateChanged(listener:(state:State, process:string, data:{ data:any })=>void) {
		this.eventEmitter.on('state-changed', listener)
	}
	onMessageReceived(listener:(message:string, process:string, metadata:{ channel:string })=>void) {
		this.eventEmitter.on('message', listener)
	}
}
