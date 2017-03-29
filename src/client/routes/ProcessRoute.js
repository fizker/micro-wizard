// @flow

import React from 'react'
import { connect } from 'react-redux'

import { shouldShowStartButton, shouldShowStopButton, shouldShowRestartButton } from '../processStates'

import CommandButtonView from '../CommandButtonView'
import MessageView from '../MessageView'

const containerStyle = {
	display: 'grid',
	gridTemplateAreas: '"header commands commands" "status status processConfig" "messages messages messages"',
	gridTemplateRows: 'min-content min-content 1fr',
	gridTemplateColumns: 'min-content 1fr min-content',
}

import { stopProcess, startProcess, restartProcess, clearMessages } from '../actions/process'

@connect(({ processes }) => ({ processes }))
export default class ProcessRoute extends React.Component {
	render() {
		const { routeParams, processes, dispatch } = this.props
		const process = processes.find(x => x.id === routeParams.id)
		if(!process) {
			// TODO: show 404 page instead, but keep URL intact
			throw new Error('process not found')
		}

		return <div style={containerStyle}>
			<h2 style={{gridArea:'header', whiteSpace: 'nowrap'}}>Process {process.id}: {process.name}</h2>
			<div style={{gridArea:'commands', alignSelf: 'center'}}>
				{shouldShowStartButton(process.currentState) && <CommandButtonView onClick={() => dispatch(startProcess(process.id))} command="start"/>}
				{shouldShowStopButton(process.currentState) && <CommandButtonView onClick={() => dispatch(stopProcess(process.id))} command="stop"/>}
				{shouldShowRestartButton(process.currentState) && <CommandButtonView onClick={() => dispatch(restartProcess(process.id))} command="restart" />}
			</div>
			<div style={{gridArea:'status'}}>
				Current state: {process.currentState}
			</div>
			<div style={{gridArea:'processConfig'}}>
				<button onClick={() => dispatch(clearMessages(process.id))}>Clear</button>
			</div>
			<MessageView messages={process.messages} style={{gridArea:'messages'}} />
		</div>
	}
}
