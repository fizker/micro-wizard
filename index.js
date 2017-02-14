// @flow

import fs from 'fs'

import Process from './src/Process'

const inputFile = process.argv[2]
readJSON(inputFile)
.then(json => {
	const process = new Process(json.processes[0])

	process.onStateChanged(({ state, data, process }) => {
		console.log('state changed', { state, data, process })
	})
	process.onMessageReceived((message, { channel, process }) => {
		console.log('message received:', message, { channel, process })
	})

	process.start()
})
.catch(e => console.error(e.stack))

function readJSON(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data))
	})
	.then(raw => JSON.parse(raw))
}
