import fetch from 'node-fetch'

import webserverConfig from './configs/single-webserver_absolute-path'
import Process from '../../src/Process'

describe('integration/process.js', () => {
	let testData
	beforeEach(() => {
		testData = {
			port: 9000,
		}
	})

	describe('web server with absolute path', () => {
		beforeEach(() => {
			testData.process = new Process(webserverConfig)
			const promise = new Promise((resolve) => {
				testData.process.onMessageReceived((message, { channel }) => {
					resolve() // first message is "server is up" or failure
				})
			})
			testData.process.start({ PORT: testData.port })
			return promise
		})
		afterEach(() => {
			return testData.process.stop()
		})

		it('should have spun a server up', () => {
			const serverResponse = fetch(`http://localhost:${testData.port}`)
			.then(res => res.text())

			return expect(serverResponse)
				.to.eventually.equal('hello world')
		})
	})
})
