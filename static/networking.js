const net = require('net')

const {Schema, StreamingAbstractor} = require('protocore')

const abstractor = new StreamingAbstractor()

abstractor.register('render', new Schema([
	{
		'name': 'entities',
		'type': 'list',
		'of': new Schema([
			{
				'name': 'type',
				'type': 'uint',
				'size': 8
			},
			{
				'name': 'color',
				'type': 'string'
			},
			{
				'name': 'x',
				'type': 'int',
				'size': 32
			},
			{
				'name': 'y',
				'type': 'int',
				'size': 32
			},
			{
				'name': 'width',
				'type': 'int',
				'size': 32
			},
			{
				'name': 'height',
				'type': 'int',
				'size': 32
			},
			{
				'name': 'xvel',
				'type': 'int',
				'size': 16
			},
			{
				'name': 'yvel',
				'type': 'int',
				'size': 16
			},
			{
				'name': 'name',
				'type': 'string'
			}
		])
	}
]))

abstractor.register('keyup', new Schema([
	{
		'name': 'key',
		'type': 'string'
	}
]))

abstractor.register('keydown', new Schema([
	{
		'name': 'key',
		'type': 'string'
	}
]))

abstractor.register('profile', new Schema([
	{
		'name': 'name',
		'type': 'string'
	}
]))

abstractor.on('render', (data) => {
	entities = data.entities
})

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

const socket = net.createConnection(5135, '10.70.6.90')

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