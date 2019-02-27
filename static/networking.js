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

abstractor.on('scoreboard', (data) => {
	scoreboard = data.scores

	console.log('New scoreboard')
	console.log(scoreboard)

	document.querySelector('#scores').innerHTML = ''

	for (let i = 0; i < scoreboard.length; i++) {
		document.querySelector('#scores').appendChild(sy('p', {'class': 'score'}, [(i + 1) + '. ' + scoreboard[i].name + ' - ' + scoreboard[i].score]))
	}
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
	else if (data.type === 1) {
		particleEntity = new canvax.Circle({
			'x': data.x,
			'y': data.y,
			'radius': 300,
			'borderColor': data.color,
			'borderWeight': 10
		})
	}
	else {
		particleEntity = new canvax.Text({
			'x': data.x,
			'y': data.y,
			'text': 'UPDATE',
			'alignment': 'center',
			'font': '70px Arial',
			'color': '#FF0000'
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

const socket = new net.Socket()

const connect = () => {
	socket.connect(8080, '35.227.153.41')

	socket.pipe(abstractor)
	abstractor.pipe(socket)
}

socket.on('connect', () => {
	console.log('Connected.')

	document.querySelector('#status').style.display = 'none'
	document.querySelector('#game').style.display = 'block'
	document.querySelector('#scoreboard').style.display = 'block'
	document.querySelector('#chat').style.display = 'block'
	
	const names = os.userInfo().username.split('.')
	
	abstractor.send('profile', {
		'name': names.map((name) => name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase()).join(' ')
	})
})

socket.on('error', (err) => {
	document.querySelector('#statusText').textContent = err.message
	
	addMessage('> Error: ' + err.message)
	
	document.querySelector('#game').style.display = 'none'
	document.querySelector('#status').style.display = 'block'
})

setTimeout(() => {
	document.querySelector('#splash').style.display = 'none'
	document.querySelector('#status').style.display = 'flex'

	connect()
}, 3000)