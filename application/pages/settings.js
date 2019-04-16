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
		if (electron.ipcRenderer.sendSync('jbcp-get', 'renderRadarChart') == true) {
			console.log(electron.ipcRenderer.sendSync('jbcp-get', 'renderRadarChart'));
			$('#renderRadarChart').prop('checked', true);
		} else {
			console.log("bla");
			$('#renderRadarChart').prop('checked', false);
		}
		$('#renderRadarChart').click(() => {
			if ($('#renderRadarChart').is(":checked")) {
				alert(electron.ipcRenderer.sendSync('jbcp-get', 'renderRadarChart'));
				electron.ipcRenderer.send('jbcp-set', { key: 'renderRadarChart', value: 'true'});
				alert(electron.ipcRenderer.sendSync('jbcp-get', 'renderRadarChart'));
				router.reload();
			} else {
				electron.ipcRenderer.send('jbcp-set', { key: 'renderRadarChart', value: 'false'});
				router.reload();
			};

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
