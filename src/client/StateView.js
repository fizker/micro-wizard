// @flow

import React from 'react'

function iconForState(state:State) {
	switch(state) {
	case 'running':
		return '/icons/is-running.svg'
	case 'stopped':
	case 'stopping':
		return '/icons/is-stopped.svg'
	case 'died':
		return '/icons/is-dead.svg'
	case 'restarting':
		return '/icons/is-restarting.svg'
	default: throw new Error('unknown state: ' + state)
	}
}

export default function StateView({ state, style = {} }:{ state:State, style?:Style }) {
	const stateStyle = {
		height: 10,
		margin: '0 5px',
	}

	return <span style={{ ...stateStyle, ...style }}>
		<img src={iconForState(state)} style={{ ...style, ...stateStyle }} />
	</span>
}
