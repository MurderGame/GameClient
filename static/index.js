const path = require('path')
const os = require('os')

const {app, shell} = require('electron')
const canvax = require('canvaxjs')

const game = new canvax.Renderer(document.querySelector('canvas'))

let entities = []

const resizeCanvas = () => {
	game.element.width = window.innerWidth
	game.element.height = window.innerHeight
}

resizeCanvas()

setInterval(resizeCanvas, 2000)

const movementUpdates = () => {	
	entities.forEach((entity) => {
		entity.xvel *= 0.91
		entity.yvel *= 0.91
		
		entity.x += entity.xvel
		entity.y += entity.yvel
	})
}

const render = () => {
	game.clear()
	
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i]
		
		if (entity.type === 0) {
			game.add(new canvax.Rectangle({
				'x': entity.x,
				'y': entity.y,
				'width': entity.width,
				'height': entity.height,
				'backgroundColor': entity.color
			}))
		}
		else if (entity.type === 1) {
			game.add(new canvax.Circle({
				'x': entity.x,
				'y': entity.y,
				'radius': entity.width,
				'backgroundColor': entity.color
			}))
		}

		if (typeof entity.name === 'string' && entity.name.length > 0) {
			game.add(new canvax.Text({
				'x': entity.x,
				'y': entity.y - 20,
				'text': entity.name,
				'font': '20px Arial',
				'color': '#000000',
				'alignment': 'center'
			}))
		}
	}
	
	game.render()

	window.requestAnimationFrame(render)
}

setInterval(movementUpdates, 5)

render()