class Settings {
	constructor() {
	}

	init() {
		$('#language-DE').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'de'});
		});
		$('#language-EN').click(() => {
			electron.ipcRenderer.send('jbcp-set', { key: 'locale', value: 'en'});
		});

		$('#renderRadarChart').prop('checked',
				electron.ipcRenderer.sendSync('jbcp-get', 'renderRadarChart'));
		$('#renderRadarChart').click(() => {
			electron.ipcRenderer.send('jbcp-set', {
				key: 'renderRadarChart',
				value: $('#renderRadarChart').is(":checked")
			});
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
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="renderRadarChart" value="option1">
  <label class="form-check-label" for="renderRadarChart">Show Radar Chart</label>
</div>
	`
};
