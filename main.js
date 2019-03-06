const {app, BrowserWindow} = require('electron');
const {KVStore, JBConfigProvider} = require('./kv-store.js');
const path = require('path');

const jbcp = new JBConfigProvider();
let mainWindow;

function createWindow () {
	let window = jbcp.store.get('window');
	mainWindow = new BrowserWindow(window);

	mainWindow.loadFile('index.html');
	mainWindow.webContents.openDevTools();

	mainWindow.on('resize', () => {
		// load current size
		let { width, height } = mainWindow.getBounds();

		// load the all old values and update only the size
		let window = jbcp.store.get('window');
		window.width = width;
		window.height = height;
		jbcp.store.set('window', window);
	});
	mainWindow.on('closed', function () {
		mainWindow = null;
	})
}

app.on('ready', function() {
	if (process.platform === 'darwin') {
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
