const net = require('net')

const abstractor = require(path.join(__dirname, 'commonAbstractorFactory.js'))()

const chatBox = document.querySelector('#chatBox')

document.body.addEventListener('keyup', (event) => {
	abstractor.send('keyup', {
		'key': event.key
	})
})

document.body.addEventListener('keydown', (event) => {
	if (document.activeElement === chatBox) {
		if (event.key === 'Escape') {
			chatBox.blur()
		}
		else if (event.key === 'Enter') {
			chatBox.blur()

			chatBox.value = ''

			abstractor.send('chat', {
				'message': chatBox.value
			})
		}
	}
	else {
		if (event.key === 't') {
			chatBox.focus()

			chatBox.setSelectionRange(0, chatBox.value.length)

			event.preventDefault()
		}
		else {
			abstractor.send('keydown', {
				'key': event.key
			})
		}
	}
})

abstractor.on('render', (data) => {
	entities = data.entities
})

abstractor.on('dead', (data) => {
	document.querySelector('#game').style.display = 'none'
	document.querySelector('#deathDisplay').style.display = 'flex'
})

document.querySelector('#respawnButton').onclick = () => {
	document.querySelector('#deathDisplay').style.display = 'none'
	document.querySelector('#game').style.display = 'block'
	
	abstractor.send('respawn', {})
}

const socket = net.createConnection(5135)

socket.pipe(abstractor)
abstractor.pipe(socket)

socket.on('connect', () => {
	document.querySelector('#status').style.display = 'none'
	document.querySelector('#game').style.display = 'block'

	console.log('Connected.')
	
	abstractor.send('profile', {
		'name': os.userInfo().username.toUpperCase()
	})
})

socket.on('error', (err) => {
	document.querySelector('#statusText').textContent = err.message

	alert(err)
	
	app.quit()
})