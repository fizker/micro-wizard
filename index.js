// @flow

import fs from 'fs'
import path from 'path'

import Group from './src/Group'

import Server from './src/server'

const inputFile = process.argv[2]

if(!inputFile) {
	console.error('Usage: micro-wizard <config.json>')
	process.exit(1)
}

const port = process.env.PORT || 8096

readJSON(inputFile)
.then(json => {
	const group = new Group(json, {
		pathToConfig: path.dirname(inputFile),
	})

	group.onStateChanged(({ state, data, process }) => {
		console.log('state changed', { state, data, process })
	})
	group.onMessageReceived((message, { channel, process }) => {
		console.log('message received:', message, { channel, process })
	})

	return group
})
.then(group => new Server(group))
.then(server => {
	return server.open(port)
		.then(() => {
			console.log(`Server running at port ${port}`)
		})
})
.catch(e => console.error(e.stack))

function readJSON(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data))
	})
	.then(raw => JSON.parse(raw))
}
