// @flow
declare function expect(mixed):any
declare function it(name:string, fn:?()=>void|Promise<*>):void
declare function describe(name:string, fn:()=>void):void
declare function beforeEach(fn:()=>void|Promise<*>):void
declare function afterEach(fn:()=>void|Promise<*>):void

import fetch from 'node-fetch'
import path from 'path'

import * as webserverConfig from './configs/simple-webserver/index'
const pathToConfig = path.join(__dirname, 'configs/simple-webserver')
import Process from '../../src/server/Process'

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
		if(start) {
			testData.process.start()
		}
		return promise
	}
	function createRequest(url = '') {
		return fetch(`http://localhost:${testData.port}/${url}`)
	}

	describe('process life-cycle - new Process', () => {
		beforeEach(() => {
			testData.processReadyPromise = createProcess(webserverConfig.absolutePath, { start: false })
		})

		it('should not not be up yet', () => {
			const fetchPromise = new DelayedPromise(300)
			.then(() => createRequest())
			return expect(fetchPromise).to.be.rejectedWith('ECONNREFUSED')
		})
		it('should be in the `stopped` state', () => {
			expect(testData.process.state).to.equal('stopped')
		})
		it('should not have emitted any state changing events', () => {
			expect(testData.onStateChanged)
				.to.not.have.been.called
		})
		it('should not have emitted any messages', () => {
			expect(testData.onMessageReceived)
				.to.not.have.been.called
		})

		describe('the process is told to start', () => {
			beforeEach(() => {
				testData.process.start()
				return new DelayedPromise(100)
			})

			it('should be in the `running` state', () => {
				expect(testData.process.state).to.equal('running')
			})
			it('should emit the change to `running` state', () => {
				expect(testData.onStateChanged)
					.to.have.been.calledWith('running')
			})
			it('should have emitted the messages that the child sends', () => {
				expect(testData.onMessageReceived)
					.to.have.been.called(2)
					.and.to.have.been.calledWith('booting on stdout\n', { channel: 'stdout' })
					.and.to.have.been.calledWith('booting on stderr\n', { channel: 'stderr' })
			})

			describe('the server is spun up', () => {
				beforeEach(() => testData.processReadyPromise)

				describe('the child crashes', () => {
					beforeEach(() => createRequest('crash').catch(() => new DelayedPromise(10)))

					it('should emit a change in state', () => {
						expect(testData.onStateChanged)
							.to.have.been.calledWith('died', { exitCode: 1 })
					})
					it('should change state to `died`', () => {
						expect(testData.process.state)
							.to.equal('died')
					})
				})
				describe('the child exits cleanly', () => {
					beforeEach(() => createRequest('exit/0').catch(() => new DelayedPromise(10)))

					it('should emit a change in state', () => {
						expect(testData.onStateChanged)
							.to.have.been.calledWith('died', { exitCode: 0 })
					})
					it('should change state to `died`', () => {
						expect(testData.process.state)
							.to.equal('died')
					})
				})
				describe('the process is told to stop', () => {
					beforeEach(() => {
						testData.stopResult = testData.process.stop()
					})
					it('should return a promise', () => {
						expect(testData.stopResult)
							.to.have.property('then').be.a('function')
					})
					it('should emit a change in state', () => {
						expect(testData.onStateChanged)
							.to.have.been.calledWith('stopping')
					})
					it('should change state to `stopping`', () => {
						expect(testData.process.state)
							.to.equal('stopping')
					})

					describe('and the child exits', () => {
						beforeEach(() => testData.stopResult)

						it('should emit a change in state', () => {
							expect(testData.onStateChanged)
								.to.have.been.calledWith('stopped')
						})
						it('should change state to `stopped`', () => {
							expect(testData.process.state)
								.to.equal('stopped')
						})
					})
					describe('and the child refuses to stop', () => {
						it('should fail the returned promise')
						it('should emit a change in state')
					})
				})
				describe('the process is told to restart', () => {
					beforeEach(() => {
						testData.restartResult = testData.process.restart()
					})
					afterEach(() => testData.restartResult)
					it('should return a promise', () => {
						expect(testData.restartResult)
							.to.have.property('then').be.a('function')
					})
					it('should emit a change in state', () => {
						expect(testData.onStateChanged)
							.to.have.been.calledWith('restarting')
					})
					it('should change state to `restarting`', () => {
						expect(testData.process.state)
							.to.equal('restarting')
					})

					it('should stop the server')
					it('should start it up again')
					// see stop-tests
					describe('returned promise resolves', () => {
						beforeEach(() => testData.restartResult)
					})
				})
			})
		})
	})

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
			if(message.startsWith('server running at port')) {
				resolve()
			}
		})
	})
}

function DelayedPromise(timer) {
	return new Promise(r => setTimeout(r, timer))
}
