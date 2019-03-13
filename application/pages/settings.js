class Settings {
	constructor() {
	}

	init() {
		$('#language-DE').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'de'});
			router.reload();
		});
		$('#language-EN').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'en'});
			router.reload();
		});
	}
}

module.exports = {
	page: Settings,
	html: `
<div class="btn-group" role="group" aria-label="Basic example">
	<button type="button" class="btn btn-secondary" id="language-EN">EN</button>
	<button type="button" class="btn btn-secondary" id="language-DE">DE</button>
</div>
	`
};
