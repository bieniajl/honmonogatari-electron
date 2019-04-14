class CharacterView {
	constructor(current_character) {
		this.current_character = current_character[0];
	}

	init() {
		for (let dataId in current_book.data.characters[this.current_character].data) {
			let data = current_book.data.characters[this.current_character].data[dataId];
			this.addDataElement(data.type, dataId, data.name, data.value);
		}

		for (let abilityId in current_book.data.characters[this.current_character].abilities) {
			let ability = current_book.data.characters[this.current_character].abilities[abilityId];
			this.addAbilityElement(abilityId, ability.name, ability.value);
		}

		for (let itemId in current_book.data.characters[this.current_character].items) {
			let item = current_book.data.characters[this.current_character].items[itemId];
			this.addItemElement(itemId, item.name, item.value);
		}
	}

	addDataElement(type, count, name = 'Data_' + count, value = '') {
		let html = `
	<div id="data-div-${count}" class="form-group row">
		<label id="data-label-${count}" for="data-input-${count}" class="col-md-2 col-form-label">
			${name}:
		</label>
		<div class="col-md-10">
			<div class="input-group">
		`;

		switch (type) {
			case 'deleted':
				return;
			case 'string':
				html += `
				<label id="data-input-${count}" class="form-control"></label>
				`;
				break;
			case 'number':
				html += `
				<label id="data-input-${count}" class="form-control"></label>
				`;
				break;
			case 'text':
				html += `
				<textarea id="data-input-${count}" class="form-control" placeholder="" readonly>
					${value}
				</textarea>
				`;
				break;
			default:
				html += `
				<label id="data-error-${count}" class="form-control">
					<i class="fas fa-exclamation-triangle" style="color:Tomato"></i>
					Failed to create input!
				</label>
				`;
		}

		html += `
			</div>
		</div>
	</div>
		`;
		$('#data').append(html);
		$('#data-input-' + count).text(value);
	}

	addAbilityElement(count, name = 'Ability_' + count, value = 0) {
		if (value == -1) return;

		$('#abilities').append(`
	<div id="ability-div-${count}" class="form-group row">
		<label id="ability-label-${count}" for="ability-input-${count}" class="col-md-5 col-form-label">
			${name}
		</label>
		<div class="col-md-7">
			<div class="progress" style="margin: 9px 0;">
				<div class="progress-bar" role="progressbar" style="width: ${value}0%" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="10">
			</div>
		</div>
	</div>
		`);
	}

	addItemElement(count, name = 'Item_' + count, value = 1) {
		if (value == -1) return;

		$('#items').append(`
	<div id="item-div-${count}" class="form-group row">
		<label id="item-label-${count}" for="item-input-${count}" class="col-md-5 col-form-label">
			${name}
		</label>
		<div class="col-md-7">
			<label id="item-input-${count}" class="form-control">
				${value}
			</label>
		</div>
	</div>
		`);
	}
}

module.exports = {
	page: CharacterView,
	html: `
<style>
.form-control[readonly] {
	background-color: #fff;
}
.form-control:focus {
	border-color: #ced4da;
	box-shadow: initial;
}
</style>

<h1>${translate.get('character-view-header')}</h1>
<hr>
<h4>${translate.get('character-data')}:</h4>
<div id="data"></div>
<hr>
<h4>${translate.get('character-abilities')}:</h4>
<div id="abilities"></div>
<hr>
<h4>${translate.get('character-inventory')}:</h4>
<div id="items"></div>
	`
};
