const {Menu} = require('electron')

const appMenu = Menu.buildFromTemplate([
	{
		'label': 'File',
		'submenu': [
			{
				'role': 'quit'
			}
		]
	}
])

module.exports = appMenu