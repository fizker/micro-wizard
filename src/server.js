import path from 'path'
import express from 'express'
import socketIO from 'socket.io'
import http from 'http'

const _server = Symbol('server')

export default class Server {
	constructor(group:Group) {
		const app = express()
		this[_server] = new http.Server(app)
		const io = socketIO(this[_server])

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
			this[_server].listen(port, err => err ? reject(err) : resolve())
		})
	}
}

function mapGroupToClient(group) : ClientModel {
	return {
		processes: group.processes.map((x, idx) => mapProcessToClient(x, idx)),
		secondaryWindow: {
			lines: 0,
			processes: [],
		},
	}
}

function mapProcessToClient(process, id) {
	return {
		id,
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
