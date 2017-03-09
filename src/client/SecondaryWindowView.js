import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import MessageView from './MessageView'

@connect(({ secondaryWindow, processes }) => ({ secondaryWindow, processes }))
export default class SecondaryWindowView extends React.Component {
	render() {
		const { secondaryWindow, processes } = this.props

		const messages = processes
		.filter(x => secondaryWindow.processes.includes(x.id))
		.reduce((mergedMessages, x) => mergedMessages
			.concat(x.messages.map(({timestamp, message}) => ({ timestamp, message: x.name + ' ' + message })))
			.sort((a,b) => compareString(a.timestamp, b.timestamp) || compareString(a.message, b.message))
		, [])

		return <div style={{ display: 'flex', flexDirection: 'column' }}>
			<MessageView
				style={{ }}
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
