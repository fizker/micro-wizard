// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import classnames from 'classnames'

import ProcessRoute from './ProcessRoute'

import { shouldShowStartButton, shouldShowStopButton, shouldShowRestartButton } from '../processStates'
import { stopProcess, startProcess, restartProcess } from '../actions/process'

import SecondaryWindowView from '../SecondaryWindowView'
import StateView from '../StateView'
import UnreadMarkerView from '../UnreadMarkerView'
import CommandButtonView from '../CommandButtonView'

const containerStyle = {
	height: '100%',
	display: 'grid',
	gridTemplateRows: 'min-content 1fr min-content',
}

type Props = {
	processes: ClientProcess[],
	secondaryWindow: {
		processes: ClientProcess[],
		lines: number,
	},
	children: React.Node,
	dispatch: Function, // TODO: Properly type redux dispatch func
}

@connect(({ processes, secondaryWindow }) => ({ processes, secondaryWindow }))
export default class MainRoute extends React.Component<Props> {
	render() {
		const { processes, secondaryWindow, dispatch } = this.props

		const shouldShowStopAllButton = processes.some(x => shouldShowStopButton(x.currentState))
		const shouldShowStartAllButton = processes.some(x => shouldShowStartButton(x.currentState))
		const shouldShowRestartAllButton = processes.some(x => shouldShowRestartButton(x.currentState))

		return <div className="MainRoute" style={containerStyle}>
			<nav>
				{shouldShowStartAllButton && <CommandButtonView
					label="Start all"
					command="start"
					onClick={() => processes.forEach(x => { if(shouldShowStartButton(x.currentState)) dispatch(startProcess(x.name)) })}
				/>}
				{shouldShowStopAllButton && <CommandButtonView
					label="Stop all"
					command="stop"
					onClick={() => processes.forEach(x => { if(shouldShowStopButton(x.currentState)) dispatch(stopProcess(x.name)) })}
				/>}
				{shouldShowRestartAllButton && <CommandButtonView
					label="Restart all"
					command="restart"
					onClick={() => processes.forEach(x => { if(shouldShowRestartButton(x.currentState)) dispatch(restartProcess(x.name)) })}
				/>}
				{processes.map(x => <Link
					key={x.name}
					to={`/processes/${x.name}`}
					style={{
						background: 'white',
						opacity: x.isEnabled ? 1 : 0.3,
					}}
				>
					{x.name}
					{x.notifications.showUnreadMessages && x.notifications.hasUnreadMessages && <UnreadMarkerView />}
					<StateView state={x.currentState} />
				</Link>)}
			</nav>
			<Route path="/processes/:id" component={ProcessRoute} />
			<SecondaryWindowView
				processes={processes}
				secondaryWindow={secondaryWindow}
			/>
		</div>
	}
}
