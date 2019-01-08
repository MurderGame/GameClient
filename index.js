const path = require('path')

const args = require('gar')(process.argv.slice(2))
const {app, BrowserWindow} = require('electron')

let win = null

const appMenu = require(path.join(__dirname, 'src', 'appMenu.js'))

app.on('ready', () => {
	let splashWin = new BrowserWindow({
		'width': 300,
		'height': 500,
		'transparent': true,
		'frame': false,
		'webPreferences': {
			'nodeIntegration': true
		},
		'resizable': false
	})

	splashWin.loadURL('file:' + path.join(__dirname, 'static', 'splash.html'))

	splashWin.setMenu(null)

	setTimeout(() => {
		win = new BrowserWindow({
			'webPreferences': {
				'nodeIntegration': true
			}
		})

		splashWin.close()

		win.loadURL('file:' + path.join(__dirname, 'static', 'index.html'))

		if (args.debug) {
			win.webContents.toggleDevTools()
		}
		else win.setMenu(appMenu)

		win.on('closed', () => {
			win = null

			process.exit(1)
		})
	}, 3000)
})