const Router = require('./application/router.js');

const router = new Router((route, data) => {
	switch (route) {
		case 'pageA':
			return require('./application/pages/pageA.js');
		case 'file-test':
			return require('./application/pages/file-test.js');
		case 'character':
			return require('./application/pages/character.js');
		case 'settings':
			return require('./application/pages/settings.js');
		default:
			return {
				html: `
					<p>Default Page</p>
				`
			};
	}
});
router.route();

//// synchronous get for settings
//console.log(electron.ipcRenderer.sendSync('jbcp-get', 'library'));
//// do not change the first value the second value is the key of the key value
//// storage which is the settings

//// asynchronous set for the settings
//electron.ipcRenderer.send('jbcp-set', { key: 'key', value: 'value'});
//// do not change the first value the second is a key value pair to store
