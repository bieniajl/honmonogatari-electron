class Page {
	constructor() {
	}

	init() {
		$('#language-DE').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'de'});
			window.location.reload();
		});
		$('#language-EN').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'en'});
			window.location.reload();
		});
	}
}

module.exports = {
	page: Page,
	html: `
<div class="btn-group" role="group" aria-label="Basic example">
	<button type="button" class="btn btn-secondary" id="language-EN">EN</button>
	<button type="button" class="btn btn-secondary" id="language-DE">DE</button>
</div>
	`
};
