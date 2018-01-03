// @flow

import fs from 'fs'
import path from 'path'

import Server from './src/server'

function logMessage(message:string) : void {
	console.log(message)
}
function logError(error:Error, details:?{ error?: Error }) : void {
	console.error(error)
	if(details && details.error) {
		console.error(details.error)
	}
}

const inputFile = process.argv[2]

if(!inputFile) {
	console.error('Usage: micro-wizard <config.json>')
	process.exit(1)
}

const port = +process.env.PORT || 8096

const signals = [
	'SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP'
]

readJSON(inputFile)
.then(group => new Server(group, {
	pathToConfig: path.dirname(inputFile),
}))
.then(server => {
	for(const signal of signals) {
		process.on(signal, (signal) => {
			logMessage(`Received signal ${signal}. Shutting down`)
			server.stopAllProcesses()
			.then(() => {
				logMessage(`All processes stopped, shutting down MicroWizard`)
				process.exit(0)
			})
			.catch((err) => {
				logError(new Error(`Failed when shutting down`), { error: err })
				process.exit(1)
			})
		})
	}

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
