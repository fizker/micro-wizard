// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'

import { MainRoute } from './routes'

import './index.css'

import socket from './socket'
import { processesWasUpdated } from './actions/process'

import reducers from './reducers'

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

socket.on('data', data => store.dispatch(processesWasUpdated(data)))

const root = document.querySelector('#root')
if(!root) {
	throw new Error('root element not found')
}

ReactDOM.render(<Provider store={store}>
	<Router>
		<Route component={MainRoute} path="/" />
	</Router>
</Provider>, root)
