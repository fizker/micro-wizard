// @flow

const initialClientModel:ClientModel = __bootstrapped.model

import process from './process'
import type { Action } from '../actions/process'

const reducers = [ process ]

export default function(state?:ClientModel = initialClientModel, action:Action) {
	const output = reducers.reduce((state, fn) => fn(state, action), state)
	if(output === state) {
		console.log('Unknown action:', action)
	}
	return output
}
