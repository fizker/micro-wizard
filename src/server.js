import path from 'path'
import express from 'express'
import socketIO from 'socket.io'
import http from 'http'

const app = express()
const server = new http.Server(app)
const io = socketIO(server)

app.use(express.static(path.join(__dirname, '../build')))

app.use((req, res, next) => {
	if(!req.accepts('html')) {
		return next()
	}

	res.send(`<!doctype html>
		<script src="/socket.io/socket.io.js"></script>
		<div id="root"></div>
		<script src="/bundle.js"></script>
	`)
})

const port = process.env.PORT || 8096
server.listen(port, () => { console.log(`Server running at port ${port}`) })
