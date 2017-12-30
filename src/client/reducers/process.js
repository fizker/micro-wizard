// @flow

import type { Action } from '../actions/process'

export default (state:ClientModel, action:Action) => {
	switch(action.type) {
	case 'PROCESSES_WAS_UPDATED':
		return {
			...state,
			...action.data,
		}
	default: return state
	}
}
