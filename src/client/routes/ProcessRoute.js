// @flow

import React from 'react'
import { connect } from 'react-redux'

import CommandButtonView from '../CommandButtonView'
import MessageView from '../MessageView'

const containerStyle = {
	display: 'grid',
	gridTemplateAreas: '"header commands" "status status" "messages messages"',
	gridTemplateRows: 'min-content min-content 1fr',
	gridTemplateColumns: 'min-content 1fr',
}

import { stopProcess, startProcess, restartProcess } from '../actions/process'

@connect(({ processes }) => ({ processes }))
export default class ProcessRoute extends React.Component {
	render() {
		const { routeParams, processes, dispatch } = this.props
		const process = processes.find(x => x.id === +routeParams.id)
		if(!process) {
			// TODO: show 404 page instead, but keep URL intact
			throw new Error('process not found')
		}

		return <div style={containerStyle}>
			<h2 style={{gridArea:'header', whiteSpace: 'nowrap'}}>Process {process.id}: {process.name}</h2>
			<div style={{gridArea:'commands', alignSelf: 'center'}}>
				{process.currentState === 'stopped' && <CommandButtonView onClick={() => dispatch(startProcess(process.id))} command="start"/>}
				{process.currentState !== 'stopped' && <CommandButtonView onClick={() => dispatch(stopProcess(process.id))} command="stop"/>}
				{process.currentState !== 'stopped' && <CommandButtonView onClick={() => dispatch(restartProcess(process.id))} command="restart" />}
			</div>
			<div style={{gridArea:'status'}}>
				Current state: {process.currentState}
			</div>
			<MessageView messages={process.messages} style={{gridArea:'messages'}} />
		</div>
	}
}
