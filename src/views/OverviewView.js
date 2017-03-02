import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import classnames from 'classnames'

export default class OverviewView extends React.Component {
	render() {
		const { currentlyActiveProcess, processes } = this.props

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
		</div>
	}
}
