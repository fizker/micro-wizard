// @flow
declare function expect():any
declare function it(name:string, fn:()=>void|Promise<*>):void
declare function describe(name:string, fn:()=>void):void
declare function beforeEach(fn:()=>void|Promise<*>):void
declare function afterEach(fn:()=>void|Promise<*>):void

import fetch from 'node-fetch'
import path from 'path'

import * as webserverConfig from './configs/simple-webserver/index'
const pathToConfig = path.join(__dirname, 'configs/simple-webserver')
import Process from '../../src/Process'

describe('integration/process.js', () => {
	let testData:any
	beforeEach(() => {
		testData = {
			port: 9000,
			onStateChanged: fzkes.fake('onStateChanged'),
			onMessageReceived: fzkes.fake('onMessageReceived'),
		}
	})
	afterEach(() => {
		if(testData.process) {
			return testData.process.stop()
		}
	})
	function createProcess(config, { start = true } = {}) {
		const options = {
			pathToConfig,
			sharedEnv: { PORT: testData.port },
		}

		testData.process = new Process(config, options)

		testData.process.onMessageReceived(testData.onMessageReceived)
		testData.process.onStateChanged(testData.onStateChanged)

		const promise = new ProcessIsUpPromise(testData.process)
		testData.process.start()
		return promise
	}

	describe('web server with absolute path', () => {
		beforeEach(() => {
			return createProcess(webserverConfig.absolutePath)
		})

		it('should have spun a server up', () => {
			const serverResponse = fetch(`http://localhost:${testData.port}`)
			.then(res => res.text())

			return expect(serverResponse)
				.to.eventually.equal('hello world')
		})

		describe('calling `process.stop()`', () => {
			beforeEach(() => {
				testData.stopPromise = testData.process.stop()
			})
			it('should send the expected state-change message', () => {
				expect(testData.onStateChanged)
					.to.have.been.calledWith('stopping')
			})
			describe('and it actually stops', () => {
				beforeEach(() => testData.stopPromise)

				it('should return a promise that resolves when the process is down', () => {
					const serverResponse = fetch(`http://localhost:${testData.port}`)

					return expect(serverResponse)
						.to.be.rejectedWith('ECONNREFUSED')
				})
				it('should send the expected state-change message', () => {
					expect(testData.onStateChanged)
						.to.have.been.calledWith('stopped')
				})
			})
		})
	})

	describe('web server with relative path', () => {
		beforeEach(() => {
			return createProcess(webserverConfig.relativePath)
		})

		it('should have spun a server up', () => {
			const serverResponse = fetch(`http://localhost:${testData.port}`)
			.then(res => res.text())

			return expect(serverResponse)
				.to.eventually.equal('hello world')
		})
	})
})

function ProcessIsUpPromise(process) {
	return new Promise((resolve) => {
		process.onMessageReceived((message, { channel }) => {
			resolve() // first message is "server is up" or failure
		})
	})
}
