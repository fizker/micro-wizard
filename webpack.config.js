'use strict'

const path = require('path')
const webpack = require('webpack')
const { WebpackConsoleLogger } = require('webpack-reporter-plugin')

const config = {
	entry: path.join(__dirname, 'src/client/index.js'),
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
	},
	plugins: [
		new WebpackConsoleLogger(),
	],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader' },
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
		],
	},
	devtool: '#source-map',
}
module.exports = config
