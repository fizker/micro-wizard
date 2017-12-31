// @flow

import socket from '../socket'

type ProcessAction = {
	type: 'PROCESS_WILL_START'|
	'PROCESS_DID_START'|
	'PROCESS_WILL_STOP'|
	'PROCESS_DID_STOP'|
	'PROCESS_WILL_RESTART'|
	'PROCESS_DID_RESTART'|
	'PROCESS_WILL_CLEAR_MESSAGES',
	process: ClientProcessName,
}
type ProcessesWasUpdatedAction = {
	type: 'PROCESSES_WAS_UPDATED',
	data: ClientModel,
}
export type Action = ProcessAction | ProcessesWasUpdatedAction

type Dispatch = (Action) => void
type ThunkAction = (Dispatch) => void

export function processWillClearMessages(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_WILL_CLEAR_MESSAGES',
		process,
	}
}

export function clearMessages(process:ClientProcessName) : ThunkAction {
	return (dispatch:Dispatch) => {
		dispatch(processWillClearMessages(process))

		socket.emit('command', { process, command: 'clearMessages' })
	}
}

export function processesWasUpdated(data:ClientModel) : ProcessesWasUpdatedAction {
	return {
		type: 'PROCESSES_WAS_UPDATED',
		data,
	}
}

export function processWillStart(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_WILL_START',
		process,
	}
}

export function processDidStart(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_DID_START',
		process,
	}
}

export function processWillStop(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_WILL_STOP',
		process,
	}
}

export function processDidStop(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_DID_STOP',
		process,
	}
}

export function processWillRestart(process:ClientProcessName) : ProcessAction {
	return {
		type: 'PROCESS_WILL_RESTART',
		process,
	}
}

export function restartProcess(process:ClientProcessName) : ThunkAction {
	return (dispatch) => {
		dispatch(processWillRestart(process))

		socket.emit('command', { command: 'restart', process })
	}
}

export function startProcess(process:ClientProcessName) : ThunkAction {
	return (dispatch) => {
		dispatch(processWillStart(process))

		socket.emit('command', { command: 'start', process })
	}
}

export function stopProcess(process:ClientProcessName) : ThunkAction {
	return (dispatch) => {
		dispatch(processWillStop(process))

		socket.emit('command', { command: 'stop', process })
	}
}
