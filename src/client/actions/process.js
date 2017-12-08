// @flow

import socket from '../socket'

import { actionTypes as types } from '../constants'

type ProcessAction = {
	type: $Keys<types>,
	process: ClientProcessName,
}
type ProcessesWasUpdatedAction = {
	type: types.PROCESSES_WAS_UPDATED,
	data: ClientModel,
}
export type Action = ProcessAction | ProcessesWasUpdatedAction

type Dispatch = (Action) => void
type ThunkAction = (Dispatch) => void

export function processWillClearMessages(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_WILL_CLEAR_MESSAGES,
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
		type: types.PROCESSES_WAS_UPDATED,
		data,
	}
}

export function processWillStart(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_WILL_START,
		process,
	}
}

export function processDidStart(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_DID_START,
		process,
	}
}

export function processWillStop(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_WILL_STOP,
		process,
	}
}

export function processDidStop(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_DID_STOP,
		process,
	}
}

export function processWillRestart(process:ClientProcessName) : ProcessAction {
	return {
		type: types.PROCESS_WILL_RESTART,
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
