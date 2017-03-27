const initialClientModel:ClientModel = __bootstrapped.model

import process from './process'

const reducers = [ process ]

export default function(state = initialClientModel, action) {
	const output = reducers.reduce((state, fn) => fn(state, action), state)
	if(output === state) {
		console.log('Unknown action:', action)
	}
	return output
}
