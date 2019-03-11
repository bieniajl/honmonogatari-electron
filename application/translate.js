class Translate {
	constructor(locale) {
		this.path = path.join(electron.remote.app.getAppPath(), "lang" , locale + '.json');
		this.data = ((filePath) => {
			try {
				return JSON.parse(fs.readFileSync(filePath));
			} catch(error) {
				return null;
			}
		})(this.path);
	}

	get(key) {
		return this.data[key];
	}

	dump() {
		return this.data;
	}
}

const translate = new Translate(electron.ipcRenderer.sendSync('jbcp-get', 'locale'));
