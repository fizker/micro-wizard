import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, browserHistory } from 'react-router'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { MainRoute, ProcessRoute } from './routes'

import './index.css'

const clientModel:ClientModel = __bootstrapped.model
/*
{
	secondaryWindow: {
		lines: 0,
		processes: [],
	},
	processes: [
		{
			id: 1,
			isEnabled: false,
			currentState: 'stopped',
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
				hasUnreadMessages: true,
				showUnreadMessages: true,
				hasStateChanges: false,
			},
			stateChanges: [
				{
					timestamp: '2017-01-01T01:00Z',
					state: 'running'
				},
				{
					timestamp: '2017-01-01T02:00Z',
					state: 'stopped'
				}
			],
		},
		{
			id: 2,
			isEnabled: true,
			currentState: 'running',
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
		{
			id: 3,
			isEnabled: true,
			currentState: 'died',
			name: 'Died',
			messages: [],
			notifications: {
				hasUnreadMessages: false,
				showUnreadMessages: true,
			}
		},
		{
			id: 4,
			isEnabled: true,
			currentState: 'restarting',
			name: 'Restarting',
			messages: [],
			notifications: {
				hasUnreadMessages: true,
				showUnreadMessages: false,
			}
		},
	]
}
*/

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