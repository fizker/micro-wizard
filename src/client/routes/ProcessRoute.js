// @flow

import React from 'react'
import { connect } from 'react-redux'

import { shouldShowStartButton, shouldShowStopButton, shouldShowRestartButton } from '../processStates'

import CommandButtonView from '../CommandButtonView'
import MessageView from '../MessageView'

const containerStyle = {
	flexDirection: 'column',
	display: 'flex',
}
const gridStyle = {
	display: 'grid',
	gridTemplateAreas: '"header commands commands" "status status processConfig"',
	gridTemplateRows: 'min-content min-content',
	gridTemplateColumns: 'min-content 1fr min-content',
}

import { stopProcess, startProcess, restartProcess, clearMessages } from '../actions/process'

type Props = {
	processes: ClientProcess[],
	dispatch: Function, // TODO: Properly type redux dispatch func
	match: {
		path: string,
		isExact: boolean,
		url: string,
		params: { id: ClientProcessName }
	},
}

@connect(({ processes }) => ({ processes }))
export default class ProcessRoute extends React.Component<Props> {
	render() {
		const { match, processes, dispatch } = this.props
		const routeParams = match.params
		const process = processes.find(x => x.name === routeParams.id)
		if(!process) {
			// TODO: show 404 page instead, but keep URL intact
			throw new Error('process not found')
		}

		return <div style={containerStyle}>
			<div style={gridStyle}>
				<h2 style={{gridArea:'header', whiteSpace: 'nowrap'}}>Process {process.name}</h2>
				<div style={{gridArea:'commands', alignSelf: 'center'}}>
					{shouldShowStartButton(process.currentState) && <CommandButtonView onClick={() => dispatch(startProcess(process.name))} command="start"/>}
					{shouldShowStopButton(process.currentState) && <CommandButtonView onClick={() => dispatch(stopProcess(process.name))} command="stop"/>}
					{shouldShowRestartButton(process.currentState) && <CommandButtonView onClick={() => dispatch(restartProcess(process.name))} command="restart" />}
				</div>
				<div style={{gridArea:'status'}}>
					Current state: {process.currentState}
				</div>
				<div style={{gridArea:'processConfig'}}>
					<button onClick={() => dispatch(clearMessages(process.name))}>Clear</button>
				</div>
			</div>
			<MessageView messages={process.messages} style={{flex: '1 0 0px'}} />
		</div>
	}
}
