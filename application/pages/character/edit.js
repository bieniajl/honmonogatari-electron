class CharacterEdit {
	constructor(route) {
		this.current_character = library.getCurrentBook().getCharacter(route[0]);
	}

	init() {
		$('#back').click(() => {
			router.navigate('character');
		});
		$('#addDataString').click(() => {
			this.addDataElement('string', this.current_character.data.length);
			this.current_character.addData('Data_' + this.current_character.data.length, 'string');
			this.run_name_edit_modal('data', this.current_character.data.length -1);
		});
		$('#addDataNumber').click(() => {
			this.addDataElement('number', this.current_character.data.length);
			this.current_character.addData('Data_' + this.current_character.data.length, 'number');
			this.run_name_edit_modal('data', this.current_character.data.length -1);
		});
		$('#addDataText').click(() => {
			this.addDataElement('text', this.current_character.data.length);
			this.current_character.addData('Data_' + this.current_character.data.length, 'text');
			this.run_name_edit_modal('data', this.current_character.data.length -1);
		});
		$('#addAbility').click(() => {
			this.addAbilityElement(this.current_character.abilities.length);
			this.current_character.addAbility('Ability_' + this.current_character.abilities.length);
			this.run_name_edit_modal('ability', this.current_character.abilities.length -1);
		});
		$('#addItem').click(() => {
			this.addItemElement(this.current_character.items.length);
			this.current_character.addItem('Item_' + this.current_character.items.length);
			this.run_name_edit_modal('item', this.current_character.items.length -1);
		});

		$('#name-edit-input').on('keypress', (event) => {
			if (event.keyCode == 13) {
				$('#name-edit-save').click();
			}
		});

		this.loadCharacter();
	}

	loadCharacter(character = this.current_character) {
		$('#data').empty();
		$('#abilities').empty();
		$('#items').empty();

		for (let dataId in character.data) {
			let data = character.data[dataId];
			this.addDataElement(data.type, dataId, data.name, data.value);
		}

		for (let abilityId in character.abilities) {
			let ability = character.abilities[abilityId];
			this.addAbilityElement(abilityId, ability.name, ability.value);
		}

		for (let itemId in character.items) {
			let item = character.items[itemId];
			this.addItemElement(itemId, item.name, item.value);
		}
	}

	addDataElement(type, count, name = 'Data_' + count, value = '') {
		let html = `
	<div id="data-div-${count}" class="form-group row">
		<label id="data-label-${count}" for="data-input-${count}" class="col-md-3 col-form-label">
			${name}:
		</label>
		<div class="col-md-9">
			<div class="input-group">
		`;

		switch (type) {
			case 'deleted':
				return;
			case 'string':
				html += `
				<input id="data-input-${count}" type="text" class="form-control" placeholder="">
				`;
				break;
			case 'number':
				html += `
				<input id="data-input-${count}" type="number" class="form-control" placeholder="">
				`;
				break;
			case 'text':
				html += `
				<textarea id="data-input-${count}" class="form-control" placeholder=""></textarea>
				`;
				break;
			default:
				html += `
				<label id="data-input-${count}" class="form-control">
					<i class="fas fa-exclamation-triangle" style="color:Tomato"></i>
					Failed to create input!
				</label>
				`;
		}

		html += `
				<div class="input-group-append">
					<button type="button" id="data-edit-${count}" class="btn btn-outline-secondary">
						<i class="fas fa-wrench"></i>
					</button>
					<button type="button" id="data-remove-${count}" class="btn btn-outline-danger">
						<i class="fas fa-backspace"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
		`;
		$('#data').append(html);
		$('#data-input-' + count).val(value);
		$('#data-input-' + count).on('change', "", count, (event) => {
			this.current_character.data[event.data].value = $('#data-input-' + event.data).val();
		});
		$('#data-edit-' + count).click(count, (event) => {
			this.run_name_edit_modal('data', event.data);
		});
		$('#data-remove-' + count).click(count, (event) => {
			$('#data-div-' + event.data).remove();
			this.current_character.data[event.data].type = 'deleted';
		});
	}

	addAbilityElement(count, name = 'Ability_' + count, value = 0) {
		if (value == -1) return;

		$('#abilities').append(`
	<div id="ability-div-${count}" class="form-group row">
		<label id="ability-label-${count}" for="ability-input-${count}" class="col-md-3 col-form-label">
			${name}
		</label>
		<div class="col-md-9">
			<div class="input-group">
				<input id="ability-input-${count}" type="range" class="form-control custom-range px-2" min="0" max="100" step="5" style="height: 38px">
				<div class="input-group-append">
					<button type="button" id="ability-edit-${count}" class="btn btn-outline-secondary">
						<i class="fas fa-wrench"></i>
					</button>
					<button type="button" id="ability-remove-${count}" class="btn btn-outline-danger">
						<i class="fas fa-backspace"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
		`);
		$('#ability-input-' + count).val(value);
		$('#ability-input-' + count).on('change', "", count, (event) => {
			this.current_character.abilities[event.data].value =
					Number($('#ability-input-' + count).val());
		});
		$('#ability-edit-' + count).click(count, (event) => {
			this.run_name_edit_modal('ability', event.data);
		});
		$('#ability-remove-' + count).click(count, (event) => {
			$('#ability-div-' + event.data).remove();
			this.current_character.abilities[event.data].value = -1;
		});
	}

	addItemElement(count, name = 'Item_' + count, value = 1) {
		if (value == -1) return;

		$('#items').append(`
	<div id="item-div-${count}" class="form-group row">
		<label id="item-label-${count}" for="item-input-${count}" class="col-md-3 col-form-label">
			${name}
		</label>
		<div class="col-md-9">
			<div class="input-group">
				<input id="item-input-${count}" type="number" class="form-control" min="0">
				<div class="input-group-append">
					<button type="button" id="item-edit-${count}" class="btn btn-outline-secondary">
						<i class="fas fa-wrench"></i>
					</button>
					<button type="button" id="item-remove-${count}" class="btn btn-outline-danger">
						<i class="fas fa-backspace"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
		`);
		$('#item-input-' + count).val(value);
		$('#item-input-' + count).on('change', "", count, (event) => {
			this.current_character.items[event.data].value =
					Number($('#item-input-' + count).val());
		});
		$('#item-edit-' + count).click(count, (event) => {
			this.run_name_edit_modal('item', event.data);
		});
		$('#item-remove-' + count).click(count, (event) => {
			$('#item-div-' + event.data).remove();
			this.current_character.items[event.data].value = -1;
		});
	}

	run_name_edit_modal(type, number) {
		switch (type) {
			case 'data':
				this.name_edit_modal_basic(this.current_character.data[number].name,
						(new_name) => {
					$('#data-label-' + number).text(new_name + ':');
					this.current_character.data[number].name = new_name;
				});
				break;
			case 'ability':
				this.name_edit_modal_basic(this.current_character.abilities[number].name,
						(new_name) => {
					$('#ability-label-' + number).text(new_name);
					this.current_character.abilities[number].name = new_name;
				});
				break;
			case 'item':
				this.name_edit_modal_basic(this.current_character.items[number].name,
						(new_name) => {
					$('#item-label-' + number).text(new_name);
					this.current_character.items[number].name = new_name;
				});
				break;
			default:
				alert('Something went wrong!\nError Code: 0x11\n' + type);
		}
	}

	name_edit_modal_basic(stored_value, callback = () => {}) {
		$('#name-edit-input').val(stored_value);
		$('#name-edit-save').off('click');
		$('#name-edit-save').one('click', () => {
			$('#name-edit-modal').modal('hide');
			callback($('#name-edit-input').val());
		});
		$('#name-edit-modal').one('shown.bs.modal', () => {
			$('#name-edit-input').focus().select();
		})
		$('#name-edit-modal').modal('show');
	}
}

module.exports = {
	page: CharacterEdit,
	html: `
<div class="dropdown float-right mt-2">
	<button class="btn btn-secondary mr-1" type="button" id="back">
		<i class="fas fa-arrow-left"></i>
		${translate.get('general-back')}
	</button>
</div>
<h1>${translate.get('character-header')}</h1>
<hr>
<form onsubmit="return false">
	<h4>${translate.get('character-data')}:</h4>
	<div id="data"></div>
	<div class="btn-group btn-block" role="group">
		<button type="button" id="addDataString" class="btn btn-outline-success btn-block">
			<i class="fas fa-plus"></i>
			${translate.get('character-addDataString')}
		</button>
		<button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
		<div class="dropdown-menu dropdown-menu-right">
			<a id="addDataNumber" class="dropdown-item" href="#">
				<i class="fas fa-plus"></i>
				${translate.get('character-addDataNumber')}
			</a>
			<a id="addDataText" class="dropdown-item" href="#">
				<i class="fas fa-plus"></i>
				${translate.get('character-addDataText')}
			</a>
		</div>
	</div>
</form>
<hr>
<form onsubmit="return false">
	<h4>${translate.get('character-abilities')}:</h4>
	<div id="abilities"></div>
	<button type="button" id="addAbility" class="btn btn-block btn-outline-success">
		<i class="fas fa-plus"></i>
		${translate.get('character-addAbility')}
	</button>
</form>
<hr>
<form onsubmit="return false">
	<h4>${translate.get('character-inventory')}:</h4>
	<div id="items"></div>
	<button type="button" id="addItem" class="btn btn-block btn-outline-success">
		<i class="fas fa-plus"></i>
		${translate.get('character-addItem')}
	</button>
</form>

<div id="name-edit-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="name-edit-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="name-edit-title" class="modal-title">
					<i class="fas fa-pen"></i>
					${translate.get('character-modal-desc')}
				</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<input id="name-edit-input" class="form-control" type="text">
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" type="button" data-dismiss="modal">
					<i class="fas fa-times"></i>
					${translate.get('general-close')}
				</button>
				<button id="name-edit-save" type="button" class="btn btn-primary">
					<i class="fas fa-save"></i>
					${translate.get('general-save')}
				</button>
			</div>
		</div>
	</div>
</div>
	`
};
