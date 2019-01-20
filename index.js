const path = require('path')

const args = require('gar')(process.argv.slice(2))
const {app, BrowserWindow} = require('electron')

let win = null

const appMenu = require(path.join(__dirname, 'src', 'appMenu.js'))

app.on('ready', () => {
	win = new BrowserWindow({
		'width': 1280,
		'height': 720,
		'resizable': false,
		'webPreferences': {
			'nodeIntegration': true
		}
	})

	win.loadURL('file:' + path.join(__dirname, 'static', 'index.html'))

	if (args.debug) {
		win.webContents.toggleDevTools()
	}
	else win.setMenu(appMenu)

	win.on('closed', () => {
		win = null

		process.exit(1)
	})
})