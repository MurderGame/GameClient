const net = require('net')

const abstractor = require(path.join(__dirname, 'commonAbstractorFactory.js'))()

document.body.addEventListener('keyup', (event) => {
	abstractor.send('keyup', {
		'key': event.key
	})
})

document.body.addEventListener('keydown', (event) => {
	abstractor.send('keydown', {
		'key': event.key
	})
})

abstractor.on('render', (data) => {
	entities = data.entities
})

abstractor.on('dead', (data) => {
	document.querySelector('canvas').style.display = 'none'
	document.querySelector('#deathDisplay').style.display = 'block'
})

document.querySelector('#respawnButton').onclick = () => {
	document.querySelector('#deathDisplay').style.display = 'none'
	document.querySelector('canvas').style.display = 'block'
	
	abstractor.send('respawn', {})
}

const socket = net.createConnection(5135)

socket.pipe(abstractor)
abstractor.pipe(socket)

socket.on('connect', () => {
	console.log('Connected.')
	
	abstractor.send('profile', {
		'name': os.userInfo().username.toUpperCase()
	})
})

socket.on('error', (err) => {
	alert(err)
	
	app.quit()
})