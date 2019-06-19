const electron = require('electron');
const {app, BrowserWindow} = require('electron');
const {KVStore, JBConfigProvider} = require('./kv-store.js');
const path = require('path');

const jbcp = new JBConfigProvider();
let mainWindow;

function createWindow () {
	electron.Menu.setApplicationMenu(null);
	/* https://electronjs.org/docs/api/menu-item
	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	const menuTemplate = [
		{
			label: "File",
			submenu:[
				{
					label: "Test"
				},
				{
					label: "Quit",
					accelerator: "Ctrl+Q",
					click() {
						app.quit();
					}
				}
			],

		},
		{
			label: "About"
		}
	]
	*/

	mainWindow = new BrowserWindow(jbcp.store.get('window'));

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
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

electron.ipcMain.on('app-close', () => {
	app.quit();
});

app.on('ready', () => {
	if (process.platform === 'darwin') {
		app.quit();
	}

	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
