const game = new canvax.Renderer(document.querySelector('#game'))

game.element.style.display = 'none'

const resizeCanvas = () => {
	game.element.width = window.innerWidth
	game.element.height = window.innerHeight
}

resizeCanvas()

setInterval(resizeCanvas, 2000)

const render = () => {
	game.render()

	window.requestAnimationFrame(render)
}

render()