const http = require('http')

const urlParsing = /\/([^\/]*)(?:\/(.+))?/

const server = http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`)

	const [ _, command, param ] = req.url.match(urlParsing) || []

	switch(command) {
		case 'crash':
			throw new Error('some uncaught error')
		case 'exit':
			process.exit(+param)
			return
	}

	res.end('hello world')
})

const port = process.env.PORT
if(!port) {
	console.error('PORT env must be set')
	process.exit(1)
}

console.log('booting on stdout')
console.error('booting on stderr')

setTimeout(() => {
	server.listen(port, () => { console.log('server running at port ' + port) })
}, 200)
