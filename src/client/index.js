import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, browserHistory } from 'react-router'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { MainRoute, ProcessRoute } from './routes'

import './index.css'

const x = 1, y = 2

const clientModel = {
	secondaryWindow: {
		lines: 3,
		processes: [ 1, 2 ],
	},
	processes: [
		{
			id: 1,
			isEnabled: false,
			name: 'Disabled process',
			messages: [ {
				timestamp: '2017-02-12T20:45Z',
				message: 'message 1',
				isUnread: false,
			}, {
				timestamp: '2017-02-12T23:45Z',
				message: 'message 3',
				isUnread: true,
			} ],
			notifications: {
				hasUnreadMessages: false,
				showUnreadMessages: true,
				hasStateChanges: false,
			},
			stateChanges: [
				{
					timestamp: '2017-01-01T01:00Z',
					state: 'running'
				}
			],
		},
		{
			id: 2,
			isEnabled: true,
			name: 'Enabled process',
			messages: [ {
				timestamp: '2017-02-12T22:45Z',
				message: 'message 2',
				isUnread: true,
			}, {
				timestamp: '2017-02-12T23:45Z',
				message: 'message 4',
				isUnread: true,
			} ],
			notifications: {
				hasUnreadMessages: true,
				showUnreadMessages: true,
				hasStateChanges: true,
			},
			stateChanges: [
				{
					timestamp: '2017-01-01T01:00Z',
					state: 'running'
				}
			],
		},
	]
}

const store = createStore((state = clientModel, action) => state)

ReactDOM.render(<Provider store={store}>
	<Router history={browserHistory}>
		<Route component={MainRoute} path="/">
			<Route path="processes">
				<Route path=":id" component={ProcessRoute} />
			</Route>
		</Route>
	</Router>
</Provider>, document.querySelector('#root'))
