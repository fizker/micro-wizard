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
		}
	})
	afterEach(() => {
		if(testData.process) {
			return testData.process.stop()
		}
	})

	describe('web server with absolute path', () => {
		beforeEach(() => {
			const options = { pathToConfig }
			testData.process = new Process(webserverConfig.absolutePath, options)
			const promise = new ProcessIsUpPromise(testData.process)
			testData.process.start({ PORT: testData.port })
			return promise
		})

		it('should have spun a server up', () => {
			const serverResponse = fetch(`http://localhost:${testData.port}`)
			.then(res => res.text())

			return expect(serverResponse)
				.to.eventually.equal('hello world')
		})

		describe('calling `process.stop()`', () => {
			beforeEach(() => {
				return testData.process.stop()
			})
			it('should return a promise that resolves when the process is down', () => {
				const serverResponse = fetch(`http://localhost:${testData.port}`)

				return expect(serverResponse)
					.to.be.rejectedWith('ECONNREFUSED')
			})
		})
	})

	describe('web server with relative path', () => {
		beforeEach(() => {
			const options = { pathToConfig }
			testData.process = new Process(webserverConfig.relativePath, options)
			const promise = new ProcessIsUpPromise(testData.process)
			testData.process.start({ PORT: testData.port })
			return promise
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
