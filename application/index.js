const { Library, Book, Character } = require('./application/library.js');
const Router = require('./application/util/router.js');

const character_routing = {
	'edit': {
		type: 'page',
		page: require('./application/pages/character/edit.js')
	},
	'main': {
		type: 'page',
		page: require('./application/pages/character/main.js')
	},
	'view': {
		type: 'page',
		page: require('./application/pages/character/view.js')
	},
	'': {
		type: 'redirect',
		redirect: 'character;main'
	}
};

const main_routing = {
	'pageA': {
		type: 'page',
		page: require('./application/pages/pageA.js')
	},
	'file-test': {
		type: 'page',
		page: require('./application/pages/file-test.js')
	},
	'character': {
		type: 'routing',
		routing: character_routing
	},
	'settings': {
		type: 'page',
		page: require('./application/pages/settings.js')
	},
	'': {
		type: 'page',
		page: {
			html: `
				<p>Default Page</p>
			`
		}
	}
};

const library = new Library(electron.ipcRenderer.sendSync('jbcp-get', 'library'));
var current_book = library.loadBook(electron.ipcRenderer.sendSync('jbcp-get',
		'currentBook'), true);

const router = new Router(main_routing).setRouteChangeCallback(() => {
	current_book.save();
}).route();

//// synchronous get for settings
//console.log(electron.ipcRenderer.sendSync('jbcp-get', 'library'));
//// do not change the first value the second value is the key of the key value
//// storage which is the settings

//// asynchronous set for the settings
//electron.ipcRenderer.send('jbcp-set', { key: 'key', value: 'value'});
//// do not change the first value the second is a key value pair to store
