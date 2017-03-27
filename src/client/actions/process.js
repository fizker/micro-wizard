// @flow

import socket from '../socket'

export const types = {
	PROCESS_WILL_START: 'PROCESS_WILL_START',
	PROCESS_DID_START: 'PROCESS_DID_START',
	PROCESS_WILL_STOP: 'PROCESS_WILL_STOP',
	PROCESS_DID_STOP: 'PROCESS_DID_STOP',
	PROCESS_WILL_RESTART: 'PROCESS_WILL_RESTART',
	PROCESS_DID_RESTART: 'PROCESS_DID_RESTART',
	PROCESSES_WAS_UPDATED: 'PROCESSES_WAS_UPDATED',
}

export function processesWasUpdated(data:ClientModel) {
	return {
		type: types.PROCESSES_WAS_UPDATED,
		data,
	}
}

export function processWillStart(process:ClientProcessID) {
	return {
		type: types.PROCESS_WILL_START,
		process,
	}
}

export function processDidStart(process:ClientProcessID) {
	return {
		type: types.PROCESS_DID_START,
		process,
	}
}

export function processWillStop(process:ClientProcessID) {
	return {
		type: types.PROCESS_WILL_STOP,
		process,
	}
}

export function processDidStop(process:ClientProcessID) {
	return {
		type: types.PROCESS_DID_STOP,
		process,
	}
}

export function processWillRestart(process:ClientProcessID) {
	return {
		type: types.PROCESS_WILL_RESTART,
		process,
	}
}

export function restartProcess(process:ClientProcessID) {
	return (dispatch) => {
		dispatch(processWillRestart(process))

		socket.emit('command', { command: 'restart', process })
	}
}

export function startProcess(process:ClientProcessID) {
	return (dispatch) => {
		dispatch(processWillStart(process))

		socket.emit('command', { command: 'start', process })
	}
}

export function stopProcess(process:ClientProcessID) {
	return (dispatch) => {
		dispatch(processWillStop(process))

		socket.emit('command', { command: 'stop', process })
	}
}
