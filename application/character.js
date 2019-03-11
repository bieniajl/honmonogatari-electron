const { Library, Book } = require('./application/library.js');

$('#add').click(() => {
	//addDataElement('string', current_book.data.characters[current_character].data.length);
	//current_book.addCharacterData(current_character,
	//		'Item_' + current_book.data.characters[current_character].data.length, 'string');
	//run_name_edit_modal('data', current_book.data.characters[current_character].data.length -1);
	addAbilityElement(current_book.data.characters[current_character].abilities.length);
	current_book.addCharacterAbility(current_character, 'Ability_'
			+ current_book.data.characters[current_character].abilities.length);
	run_name_edit_modal('ability', current_book.data.characters[current_character].abilities.length -1);
});
$('#name-edit-input').on('keypress', (event) => {
	if (event.keyCode == 13) {
		$('#name-edit-save').click();
	}
});

let lib = new Library(electron.ipcRenderer.sendSync('jbcp-get', 'library'));
let current_book = lib.addBook('tmp');
current_book.addCharacter();
let current_character = 0;

function loadCharacter(current_book, character) {
	$('#data').empty();
	$('#abilities').empty();

	for (dataId in current_book.data.characters[character].data) {
		data = current_book.data.characters[character].data[dataId];
		addDataElement(data.type, dataId, data.name, data.value);
	}

	for (abilityId in current_book.data.characters[character].abilities) {
		ability = current_book.data.characters[character].abilities[abilityId];
		addAbilityElement(abilityId, ability.name, ability.value);
	}
}

function addDataElement(type, count, name = 'Item_' + count, value = '') {
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
	$('#data-input-' + count).on('keyup', count, (event) => {
		current_book.data.characters[current_character].data[event.data].value = $('#data-input-' + count).val();
	});
	$('#data-edit-' + count).click(count, (event) => {
		run_name_edit_modal('data', event.data);
	});
	$('#data-remove-' + count).click(count, (event) => {
		$('#data-div-' + event.data).remove();
		current_book.data.characters[current_character].data[event.data].type = 'deleted';
	});
}

function addAbilityElement(count, name = 'Ability_' + count, value = 0) {
	if (value == -1) return;

	$('#abilities').append(`
<div id="ability-div-${count}" class="form-group row">
	<label id="ability-label-${count}" for="ability-input-${count}" class="col-md-5 col-form-label">
		${name}
	</label>
	<div class="col-md-7">
		<div class="input-group">
			<input id="ability-input-${count}" type="range" class="form-control custom-range" min="0" max="10" style="height: 38px">
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
	$('#ability-input-' + count).on('change', count, (event) => {
		current_book.data.characters[current_character].abilities[event.data].value =
				$('#ability-input-' + count).val();
	});
	$('#ability-edit-' + count).click(count, (event) => {
		run_name_edit_modal('ability', event.data);
	});
	$('#ability-remove-' + count).click(count, (event) => {
		$('#ability-div-' + event.data).remove();
		current_book.data.characters[current_character].abilities[event.data].value = -1;
	});
}

function run_name_edit_modal(type, number) {
	switch (type) {
		case 'data':
			name_edit_modal_basic(current_book.data.characters[current_character].data[number].name,
					(new_name) => {
				$('#data-label-' + number).text(new_name + ':');
				current_book.data.characters[current_character].data[number].name = new_name;
			});
			break;
		case 'ability':
			name_edit_modal_basic(current_book.data.characters[current_character].abilities[number].name,
					(new_name) => {
				$('#ability-label-' + number).text(new_name);
				current_book.data.characters[current_character].abilities[number].name = new_name;
			});
			break;
		default:
			alert('Something went wrong!\nError Code: 0x11\n' + type);
	}
}

function name_edit_modal_basic(stored_value, callback = () => {}) {
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
