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

		this.processes = processes.map(x => {
			const p = new Process(x, { pathToConfig })
			p.onStateChanged(({ state, data }) => {
				this.eventEmitter.emit('state-changed', { process: p.name, state, data })
			})
			p.onMessageReceived((message, { channel }) => {
				this.eventEmitter.emit('message', message, { channel, process: p.name })
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

	onStateChanged(listener:(data:{ state:State, data:any, process:string })=>void) {
		this.eventEmitter.on('state-changed', listener)
	}
	onMessageReceived(listener:(message:string, metadata:{ channel:string, process:string })=>void) {
		this.eventEmitter.on('message', listener)
	}
}
