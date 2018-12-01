// @flow

import path from 'path'
import express from 'express'
import SocketIO from 'socket.io'
import http from 'http'

import Group from './Group'
import type { GroupOptions } from './Group'

type Process = {
	state: State,
	name: string,
}

declare class Socket {
	on(key:string, fn:Function) : void;
	emit(key:string, val:any) : void;
}

export default class Server {
	_server:http.Server
	_socketIO:SocketIO
	_sockets:Socket[]
	_group:Group
	_messages:{[id:string]:Array<ClientProcessMessage>}

	constructor(groupJSON:GroupJSON, groupOptions:GroupOptions) {
		const app = express()
		this._messages = {}
		this._group = new Group(groupJSON, groupOptions)
		this._group.onStateChanged((state, process, { data }) => {
			if(state === 'died') {
				const message = data.exitCode != null
					? `<exited with code ${data.exitCode}>`
					: `<signal: ${data.signal}>`
				this.appendMessage(process, message)
			}
			this.updateClients()
		})
		this._group.onMessageReceived((message, process, { channel }) => {
			this.appendMessage(process, message)
			this.updateClients()
		})

		this._server = new (http.Server:any)(app)
		this._socketIO = new SocketIO(this._server)

		this._sockets = []
		this._socketIO.on('connection', (socket:Socket) => {
			this._sockets.push(socket)
			console.log('got connection, now have', this._sockets.length)
			socket.on('disconnect', () => {
				this._sockets = this._sockets.filter(x => x !== socket)
				console.log('disconnect, now have', this._sockets.length)
			})
			socket.on('command', ({ process, command }:{process:string, command:Command}) => {
				const p = this._group.processes.find(x => x.name === process)
				if(!p) {
					console.error(`Unknown process id: ${process}`)
					throw new Error(`Unknown process id: ${process}`)
				}

				switch(command) {
				case 'start':
					this.appendMessage(p.name, '<starting>')
					p.start()
					return
				case 'stop':
					this.appendMessage(p.name, '<stopping>')
					p.stop()
					return
				case 'restart':
					this.appendMessage(p.name, '<restarting>')
					p.restart()
					return
				case 'clearMessages':
					this._messages[p.name] = []
					this.updateClients()
					return
				}
			})
		})

		app.use(express.static(path.join(__dirname, '../../build')))
		app.use(express.static(path.join(__dirname, '../../static')))

		app.use((req, res, next) => {
			if(!req.accepts('html')) {
				return next()
			}

			res.send(`<!doctype html>
				<script src="/socket.io/socket.io.js"></script>
				<div id="root"></div>
				<script>
					const __bootstrapped = {
						model: ${JSON.stringify(mapGroupToClient(this._group, this._messages))},
					}
				</script>
				<script src="/bundle.js"></script>
			`)
		})
	}

	open(port:number) : Promise<void> {
		return new Promise((resolve, reject) => {
			this._server.listen(port, err => err ? reject(err) : resolve())
		})
	}

	appendMessage(process:ClientProcessName, message:string) {
		const messagesForProcess = this._messages[process] || []
		messagesForProcess.push({
			message,
			isUnread: true,
			timestamp: new Date().toJSON(),
		})
		this._messages[process] = messagesForProcess
	}

	updateClients() {
		this._socketIO.emit('data', mapGroupToClient(this._group, this._messages))
	}

	stopAllProcesses() {
		return this._group.stopAll()
	}
}

function mapGroupToClient(group:Group, allMessages:{[string]:ClientProcessMessage[]}) : ClientModel {
	return {
		processes: group.processes.map((x) => mapProcessToClient(x, allMessages[x.name])),
		secondaryWindow: {
			lines: 0,
			processes: [],
		},
	}
}

function mapProcessToClient(process:Process, messages:ClientProcessMessage[] = []) : ClientProcess {
	return {
		isEnabled: process.state !== 'stopped',
		currentState: process.state,
		name: process.name,
		notifications: {
			hasUnreadMessages: messages.some(x => x.isUnread),
			showUnreadMessages: true,
			hasStateChanges: false,
		},
		messages,
		stateChanges: [],
	}
}
