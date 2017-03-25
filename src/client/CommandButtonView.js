// @flow

import React from 'react'

type Props = {
	command:Command,
	style?: Object,
	onClick: ()=>void,
}

const buttonStyle = {
	textAlign: 'center',
	height: 30,
	width: 30,
	padding: 5,
	background: 'transparent',
	border: 0,
	cursor: 'pointer',
	margin: '0 5px',
}

const imageStyle = {
	maxHeight: 14,
	maxWidth: 14,
	verticalAlign: 'middle',
}

export default function CommandButton({ command, onClick, ...props }: Props = {}) {
	let text
	let icon
	let action

	switch(command) {
	case 'start':
		text = 'Start'
		icon = '/icons/is-running.svg'
		break
	case 'restart':
		text = 'Restart'
		icon = '/icons/is-restarting.svg'
		break
	case 'stop':
		text = 'Stop'
		icon = '/icons/is-stopped.svg'
		break
	}

	return <button style={buttonStyle}>
		<img style={imageStyle} src={icon} alt={text} onClick={() => onClick()} />
	</button>
}
