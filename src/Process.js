// @flow

import { ChildProcess, exec } from 'child_process'
import EventEmitter from 'events'
import path from 'path'

type ProcessOptions = {
	pathToConfig:string,
	sharedEnv:Env,
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

	constructor(data:ProcessJSON, { pathToConfig, sharedEnv }:ProcessOptions) {
		this.name = data.name
		this.exec = data.exec
		this.workingDir = path.isAbsolute(data.workingDir)
			? data.workingDir
			: path.join(pathToConfig, data.workingDir)
		this.env = { ...process.env, ...sharedEnv, ...data.env }

		this.eventEmitter = new EventEmitter
		this.changeState('stopped')
	}

	onStateChanged(listener:(data:{ state:State, data:any })=>void) {
		this.eventEmitter.on('state-changed', listener)
	}
	onMessageReceived(listener:(message:string, metadata:{ channel:string })=>void) {
		this.eventEmitter.on('message', listener)
	}

	start() {
		const actualProcess = this.actualProcess = exec(this.exec, {
			cwd: this.workingDir,
			env: this.env,
		})
		this.changeState('running')

		actualProcess.on('close', (exitCode, signal) => {
			if(this.state != 'running') return

			this.changeState('died', { exitCode, signal })
		})
		actualProcess.stdout.on('data', data => {
			this.eventEmitter.emit('message', data.toString(), { channel: 'stdout' })
		})
		actualProcess.stderr.on('data', data => {
			this.eventEmitter.emit('message', data.toString(), { channel: 'stderr' })
		})
	}

	changeState(state:State, data:any = {}) {
		this.state = state
		this.stateData = data

		this.eventEmitter.emit('state-changed', state, data)
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
