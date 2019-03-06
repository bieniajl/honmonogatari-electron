const {app, BrowserWindow} = require('electron');
const KVStore = require('./kv-store.js');

const config = new KVStore({
	name: "preferences",
	defaults: {
		window: {
			width: 800,
			height: 600,
			frame: false,
			webPreferences: {
				nodeIntegration: true
			}
		}
	}
});

let mainWindow;

function createWindow () {
	let window = config.get('window');
	mainWindow = new BrowserWindow(window);

	mainWindow.loadFile('index.html');
	mainWindow.webContents.openDevTools();

	mainWindow.on('resize', () => {
		// load current size
		let { width, height } = mainWindow.getBounds();

		// load the all old values and update only the size
		let window = config.get('window');
		window.width = width;
		window.height = height;
		config.set('window', window);
	});
	mainWindow.on('closed', function () {
		mainWindow = null;
	})
}

app.on('ready', function() {
	if (process.platform == 'darwin') {
		app.quit();
	}

	createWindow();
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
});
