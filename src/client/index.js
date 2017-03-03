import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { MainRoute } from './routes'

const x = 1, y = 2

const clientModel = {
	currentlyActiveProcess: 1,
	subWindows: [ {
		location: [x,y],
		processes: [ 1, 2 ],
	}, {
		location: [x,y],
		processes: [ 1 ],
	} ],
	processes: [
		{
			id: 1,
			isEnabled: false,
			name: 'Disabled process',
			messages: [ {
				timestamp: '2017-02-12T23:45Z',
				message: 'bla bla bla',
				isUnread: false,
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
				timestamp: '2017-02-12T23:45Z',
				message: 'bla bla bla',
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
	<MainRoute />
</Provider>, document.querySelector('#root'))
