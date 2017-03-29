// @flow

import React from 'react'

type Props = {
	label?: string,
	hasLabel?: bool,
	command: Command,
	style?: Object,
	onClick: ()=>void,
}

const buttonStyle = {
	textAlign: 'center',
	height: 30,
	minWidth: 30,
	backgroundColor: 'transparent',
	border: 0,
	cursor: 'pointer',
	margin: '0 5px',
}

const buttonWithLabelStyle = {
	...buttonStyle,
	display: 'inline-flex',
	flexDirection: 'column',
	alignItems: 'center',
}

const imageStyle = {
	maxHeight: 14,
	maxWidth: 14,
	verticalAlign: 'middle',
}

export default function CommandButton({ label, hasLabel = label != null, command, onClick, ...props }: Props = {}) {
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

	if(label != null) {
		text = label
	}

	return <button style={hasLabel ? buttonWithLabelStyle : buttonStyle} title={hasLabel ? null : text}>
		<img style={imageStyle} src={icon} alt={text} onClick={() => onClick()} />
		{hasLabel && text}
	</button>
}
