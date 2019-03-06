// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const KVStore = require('./kv-store.js');
const config = new KVStore({
	name: 'preferences',
	defaults: {}
});

console.log(config.get('window'));
