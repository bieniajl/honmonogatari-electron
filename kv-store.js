const electron = require('electron');
const path = require('path');
const fs = require('fs');

class KVStore {
	constructor(opts) {
		this.name = opts.name;
		this.path = path.join(electron.app.getPath('userData'), this.name + '.json');
		this.data = ((filePath, defaults) => {
			try {
				return JSON.parse(fs.readFileSync(filePath));
			} catch(error) {
				return defaults;
			}
		})(this.path, opts.defaults);
	}

	get(key) {
		return this.data[key];
	}

	set(key, val) {
		this.data[key] = val;
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}

	dump() {
		return this.data;
	}
}

class JBConfigProvider {
	constructor() {
		this.store = new KVStore({
			name: "preferences",
			defaults: {
				library: path.join(electron.app.getPath('userData'), 'library'),
				locale: "en",
				window: {
					width: 800,
					height: 600,
					frame: true,
					webPreferences: {
						nodeIntegration: true
					}
				}
			}
		});

		electron.ipcMain.on('jbcp-get', (event, arg) => {
			if (arg === '')
				event.returnValue = this.store.dump();
			else
				event.returnValue = this.store.get(arg);
		});

		electron.ipcMain.on('jbcp-set', (event, arg) => {
			this.store.set(arg.key, arg.value);
		});
	}
}

module.exports = { KVStore, JBConfigProvider };
