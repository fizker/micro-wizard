// @flow

import { ChildProcess, exec } from 'child_process'
import EventEmitter from 'events'

const states = {
	stopped: 'stopped',
	running: 'running',
	restarting: 'restarting',
	stopping: 'stopping',
}

export default class Process {
	name:string
	exec:string
	workingDir:string
	env:Env

	actualProcess:?ChildProcess

	state:State
	stateData:any

	eventEmitter:EventEmitter

	constructor(data:ProcessJSON) {
		this.name = data.name
		this.exec = data.exec
		this.workingDir = data.workingDir
		this.env = data.env

		this.eventEmitter = new EventEmitter
		this.changeState('stopped')
	}

	onStateChanged(listener:(data:{ state:State, data:any, process:string })=>void) {
		this.eventEmitter.on('state-changed', listener)
	}
	onMessageReceived(listener:(message:string, metadata:{ channel:string, process:string })=>void) {
		this.eventEmitter.on('message', listener)
	}

	start(sharedEnv:Env = {}) {
		const actualProcess = this.actualProcess = exec(this.exec, {
			cwd: this.workingDir,
			env: { ...process.env, ...sharedEnv, ...this.env },
		})
		this.changeState('running', { sharedEnv })

		actualProcess.on('close', (exitCode, signal) => {
			if(this.state != 'running') return

			this.changeState('died', { exitCode, signal })
		})
		actualProcess.stdout.on('data', data => {
			this.eventEmitter.emit('message', data.toString(), { channel: 'stdout', process: this.name })
		})
		actualProcess.stderr.on('data', data => {
			this.eventEmitter.emit('message', data.toString(), { channel: 'stderr', process: this.name })
		})
	}

	changeState(state:State, data:any = {}) {
		this.state = state
		this.stateData = data

		this.eventEmitter.emit('state-changed', { state, data, process: this.name })
	}

	stop() {
		const actualProcess = this.actualProcess
		this.actualProcess = null
		if(actualProcess == null) return Promise.resolve()

		return new Promise((resolve, reject) => {
			if(this.state != 'restarting') this.changeState('stopping')

			actualProcess.on('close', (exitCode, signal) => {
				this.changeState('stopped', { exitCode })
				resolve()
			})

			actualProcess.kill()
		})
	}

	restart() {
		if(this.state != 'running') { throw new Error('cannot restart a process that is not running') }

		const sharedEnv = this.stateData.sharedEnv
		this.changeState('restarting')
		return this.stop().then(() => this.start(sharedEnv))
	}
}
