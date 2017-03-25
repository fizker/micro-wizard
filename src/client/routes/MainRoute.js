import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classnames from 'classnames'

import SecondaryWindowView from '../SecondaryWindowView'
import StateView from '../StateView'
import UnreadMarkerView from '../UnreadMarkerView'

const containerStyle = {
	height: '100%',
	display: 'grid',
	gridTemplateRows: 'min-content 1fr min-content'
}

@connect(({ processes }) => ({ processes }))
export default class MainRoute extends React.Component {
	render() {
		const { processes } = this.props

		return <div className="MainRoute" style={containerStyle}>
			<nav>
				{processes.map(x => <Link
					key={x.id}
					to={`/processes/${x.id}`}
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
			{this.props.children}
			<SecondaryWindowView />
		</div>
	}
}
