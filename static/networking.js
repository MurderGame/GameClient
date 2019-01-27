const net = require('net')

const abstractor = require(path.join(__dirname, 'commonAbstractorFactory.js'))()

const chatBox = document.querySelector('#chatBox')

const addMessage = (text) => {
	const messageElement = sy('p', {'class': 'message'}, [text])
	
	document.querySelector('#messages').appendChild(messageElement)
	
	setTimeout(() => {
		messageElement.style.opacity = 0
		
		setTimeout(() => {
			messageElement.parentElement.removeChild(messageElement)
		}, 500)
	}, 10 * 1000)
}

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

			abstractor.send('chat', {
				'message': chatBox.value,
				'from': ''
			})
			
			chatBox.value = ''
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

let bgColor = ''

abstractor.on('render', (data) => {
	if (bgColor !== data.backgroundColor) {
		console.log('Updating game background color.')

		bgColor = data.backgroundColor

		game.element.style.backgroundColor = data.backgroundColor
	}

	entities = data.entities
})

abstractor.on('blur', () => {
	game.ctx.filter = 'blur(1px)'

	setTimeout(() => {
		game.ctx.filter = 'none'
	}, 300)
})

abstractor.on('particle', (data) => {
	let particleEntity

	if (data.type === 0) {
		particleEntity = new canvax.Circle({
			'x': data.x,
			'y': data.y,
			'radius': 1,
			'borderColor': data.color,
			'borderWeight': 10
		})
	}

	particles.push({
		'type': data.type,
		'entity': particleEntity
	})
})

abstractor.on('chat', (data) => {
	addMessage(data.message)
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
	
	addMessage('> Connected to server!')
	
	addMessage('Press \'t\' to chat.')

	console.log('Connected.')
	
	const names = os.userInfo().username.split('.')
	
	abstractor.send('profile', {
		'name': names.map((name) => name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase()).join('.')
	})
})

socket.on('error', (err) => {
	document.querySelector('#statusText').textContent = err.message
	
	addMessage('> Error: ' + err.message)
	
	document.querySelector('#game').style.display = 'none'
	document.querySelector('#status').style.display = 'block'
})