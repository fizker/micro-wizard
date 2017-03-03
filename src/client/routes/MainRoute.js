import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classnames from 'classnames'

@connect(({ processes }) => ({ processes }))
export default class MainRoute extends React.Component {
	render() {
		const { processes } = this.props

		return <div>
			<style>{`
				.process {
					background: white;
				}
				.process--enabled {
					background: blue;
				}
			`}
			</style>
			{processes.map(x => <Link
				key={x.id}
				to={`/processes/${x.id}`}
				className={classnames({
					'process': true,
					'process--enabled': x.isEnabled,
				})}
			>
				{x.name}
			</Link>)}
			{this.props.children}
		</div>
	}
}
