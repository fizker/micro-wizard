const http = require('http')

const server = http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`)
	res.end('hello world')
})

const port = process.env.PORT
if(!port) {
	console.error('PORT env must be set')
	process.exit(1)
}

server.listen(port, () => { console.log('server running at port ' + port) })
