const path = require('path')
const os = require('os')

const {app, shell} = require('electron')
const canvax = require('canvaxjs')

const sy=function sy(tag,attribs,children){if(!tag)throw new Error("Missing tag argument.");var gen=document.createElement(tag);if(attribs)Object.keys(attribs).forEach(function(attrib){return gen.setAttribute(attrib,attribs[attrib])});if(children)children.forEach(function(child){return child!==null?gen.appendChild(typeof child==="string"?document.createTextNode(child):child):null});return gen};

const generalScaling = 0.98

const game = new canvax.Renderer(document.querySelector('canvas'))

let scoreboard = []

let entities = []
const particles = []

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

	particles.forEach((particle, i) => {
		if (particle.type === 0) {
			particle.entity.radius += 5

			if (particle.entity.radius > 3000) {
				console.log('Deleting particle.')

				particles.splice(i, 1)
			}
		}
		else if (particle.type === 1) {
			particle.entity.radius -= 3

			if (particle.entity.radius <= 0) {
				console.log('Deleting particle.')

				particles.splice(i, 1)
			}
		}
	})
}

let clientEntity = false

const render = () => {
	game.clear()

	// Bounding rect + text

	game.add(new canvax.Rectangle({
		'x': 0,
		'y': 0,
		'width': 1280,
		'height': 720,
		'borderColor': '#0428F3',
		'borderWeight': 2
	}))

	game.add(new canvax.Text({
		'x': 1280 / 2,
		'y': 720 + 40,
		'font': '30px Arial',
		'alignment': 'center',
		'text': 'Ethan Davis, 2019'
	}))

	// Entities
	
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i]
		
		if (entity.type === 0) {
			const parsedEntity = new canvax.Rectangle({
				'x': entity.x,
				'y': entity.y,
				'width': entity.width,
				'height': entity.height,
				'backgroundColor': entity.color
			})

			game.add(parsedEntity)

			if (entity.isClient) {
				clientEntity = parsedEntity
			}
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
				'x': entity.x + (entity.type === 0 ? entity.width : 0) / 2,
				'y': entity.y - 20,
				'text': entity.name,
				'font': '20px Roboto',
				'color': '#000000',
				'alignment': 'center'
			}))
		}
	}

	// Apply transformations

	if (clientEntity) {
		game.ctx.setTransform(generalScaling, (clientEntity.x - game.element.width / 2) / 18000, (clientEntity.y - game.element.height / 2) / 18000, generalScaling, -1 * (clientEntity.x - game.element.width / 2) / 4, -1 * (clientEntity.y - game.element.height / 2) / 4)
	}
	else game.ctx.setTransform(1, 0, 0, 1, 0, 0)

	for (let i = 0; i < particles.length; i++) {
		game.add(particles[i].entity)
	}
	
	game.render()

	window.requestAnimationFrame(render)
}

setInterval(movementUpdates, 5)

render()