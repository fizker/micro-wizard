// @flow

import EventEmitter from 'events'

import Process from './Process'

type GroupOptions = {
	pathToConfig:string,
}

export default class Group {
	processes:Array<Process>
	sharedEnv:Env
	eventEmitter:EventEmitter

	constructor({ sharedEnv = {}, processes = [] }:GroupJSON = {}, { pathToConfig }:GroupOptions) {
		this.eventEmitter = new EventEmitter

		this.processes = processes.map((x, idx) => {
			const p = new Process(idx.toString(), x, { sharedEnv, pathToConfig })
			p.onStateChanged((state, data) => {
				this.eventEmitter.emit('state-changed', state, p.id, { data })
			})
			p.onMessageReceived((message, { channel }) => {
				this.eventEmitter.emit('message', message, p.id, { channel })
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
