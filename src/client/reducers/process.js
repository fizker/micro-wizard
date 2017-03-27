// @flow

import { actionTypes as types } from '../constants'

export default (state, action) => {
	switch(action.type) {
	case types.PROCESSES_WAS_UPDATED:
		return {
			...state,
			...action.data,
		}
	default: return state
	}
}
