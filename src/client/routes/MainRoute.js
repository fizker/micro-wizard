import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classnames from 'classnames'

import './MainRoute.css'

import SecondaryWindowView from '../SecondaryWindowView'
import StateView from '../StateView'
import UnreadMarkerView from '../UnreadMarkerView'

@connect(({ processes }) => ({ processes }))
export default class MainRoute extends React.Component {
	render() {
		const { processes } = this.props

		return <div className="MainRoute">
			<nav>
				{processes.map(x => <Link
					key={x.id}
					to={`/processes/${x.id}`}
					className={classnames({
						'MainRoute__nav__process': true,
						'MainRoute__nav__process--enabled': x.isEnabled,
						'MainRoute__nav__process--disabled': !x.isEnabled,
					})}
				>
					{x.name}
					{x.notifications.showUnreadMessages && x.notifications.hasUnreadMessages && <UnreadMarkerView />}
					<StateView state={x.currentState} />
				</Link>)}
			</nav>
			{this.props.children}
			<SecondaryWindowView />
		</div>
	}
}
