import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import MessageView from '../MessageView'

@connect(({ processes }) => ({ processes }))
export default class ProcessRoute extends React.Component {
	render() {
		const { routeParams, processes } = this.props
		const process = processes.find(x => x.id === +routeParams.id)
		if(!process) {
			// TODO: show 404 page instead, but keep URL intact
			throw new Error('process not found')
		}

		return <div style={{ display: 'flex', flexDirection: 'column' }}>
			<h2>Process {process.id}: {process.name}</h2>
			<MessageView messages={process.messages} style={{flexGrow:1}} />
		</div>
	}
}
