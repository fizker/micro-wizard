// @flow

import React from 'react'

import MessageView from './MessageView'

type Props = {
	secondaryWindow: {
		processes: ClientProcess[],
		lines: number,
	},
	processes: ClientProcess[],
}

export default class SecondaryWindowView extends React.Component<Props> {
	render() {
		const { secondaryWindow, processes } = this.props

		const messages:ClientProcessMessage[] = processes
		// TODO: Add support for secondary-window eventually
		.filter(x => false)//secondaryWindow.processes.includes(x.id))
		.reduce((mergedMessages, x) => mergedMessages
			.concat(x.messages.map(({isUnread, timestamp, message}) => ({ isUnread, timestamp, message: x.name + ' ' + message })))
			.sort((a,b) => compareString(a.timestamp, b.timestamp) || compareString(a.message, b.message))
		, [])

		return <div style={{ display: 'flex', flexDirection: 'column' }}>
			<MessageView
				lineCount={secondaryWindow.lines}
				messages={messages}
			/>
		</div>
	}
}

function compareString(a, b) {
	if(a === b) return 0
	return a < b ? -1 : 1
}
