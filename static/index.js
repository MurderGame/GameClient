const path = require('path')
const os = require('os')

const {app} = require('electron')

const game = new canvax.Renderer(document.querySelector('#game'))

let entities = []

const resizeCanvas = () => {
	game.element.width = window.innerWidth
	game.element.height = window.innerHeight
}

resizeCanvas()

setInterval(resizeCanvas, 2000)

const movementUpdates = () => {	
	entities.forEach((entity) => {
		entity.xvel *= 0.93
		entity.yvel *= 0.93
		
		entity.x += entity.xvel
		entity.y += entity.yvel
	})
}

const render = () => {
	game.clear()
	
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i]
		
		if (entity.type === 0) {
			game.add(new canvax.Rectangle(entity.x, entity.y, entity.width, entity.height, entity.color, 'none', 0))
			game.add(new canvax.Text(entity.x, entity.y - 20, entity.name, '20px Arial', '#000000', 'center'))
		}
		
		if (entity.type === 1) {
			game.add(new canvax.Circle(entity.x, entity.y, entity.width, entity.color, 'none'))
		}
	}
	
	game.render()

	window.requestAnimationFrame(render)
}

setInterval(movementUpdates, 10)

render()