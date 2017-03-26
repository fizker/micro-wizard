// @flow

import path from 'path'
import express from 'express'
import SocketIO from 'socket.io'
import http from 'http'

const _server = Symbol('server')
const _socketIO = Symbol('socket.io')
const _group = Symbol('group')
const _sockets = Symbol('sockets')

declare class Socket {
	on(key:string, fn:Function) : void;
	emit(key:string, val:any) : void;
}

export default class Server {
	_server:http.Server
	_socketIO:SocketIO
	_sockets:Socket[]
	constructor(group:Group) {
		const app = express()
		this._server = new http.Server(app)
		this._socketIO = new SocketIO(this._server)

		this._sockets = []
		this._socketIO.on('connection', (socket:Socket) => {
			this._sockets.push(socket)
			console.log('got connection, now have', this._sockets.length)
			socket.on('disconnect', () => {
				this._sockets = this._sockets.filter(x => x !== socket)
				console.log('disconnect, now have', this._sockets.length)
			})
			socket.on('command', (msg:{process:ClientProcessID, command:Command}) => {
				console.log(msg)
			})
		})

		app.use(express.static(path.join(__dirname, '../build')))
		app.use(express.static(path.join(__dirname, '../static')))

		app.use((req, res, next) => {
			if(!req.accepts('html')) {
				return next()
			}

			res.send(`<!doctype html>
				<script src="/socket.io/socket.io.js"></script>
				<div id="root"></div>
				<script>
					const __bootstrapped = {
						model: ${JSON.stringify(mapGroupToClient(group))},
					}
				</script>
				<script src="/bundle.js"></script>
			`)
		})
	}

	open(port:number) {
		return new Promise((resolve, reject) => {
			this._server.listen(port, err => err ? reject(err) : resolve())
		})
	}
}

function mapGroupToClient(group) : ClientModel {
	return {
		processes: group.processes.map((x) => mapProcessToClient(x)),
		secondaryWindow: {
			lines: 0,
			processes: [],
		},
	}
}

function mapProcessToClient(process) {
	return {
		id: process.id,
		isEnabled: process.state !== 'stopped',
		currentState: process.state,
		name: process.name,
		notifications: {
			hasUnreadMessages: false,
			showUnreadMessages: true,
			hasStateChanges: false,
		},
		messages: [],
		stateChanges: [],
	}
}
