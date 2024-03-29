class CharacterMain {
	constructor() {
	}

	init() {
		let addFunction = () => {
			library.getCurrentBook().addCharacter();
			router.navigate('character;edit;' + (library.getCurrentBook().data.characters.length - 1));
		};
		$('#add').click(addFunction);
		$('#add2').click(addFunction);
		this.loadBook();
	}

	loadBook() {
		$('#characters').empty();

		for (let characterId in library.getCurrentBook().data.characters) {
			let character = library.getCurrentBook().data.characters[characterId];
			if (isEmpty(character)) continue;
			let name = 'Character_' + characterId;
			if (!isEmpty(character.data[0]))
				name = character.data[0].name + ': ' + character.data[0].value;
			this.addCharacterElement(characterId, name);
		}
	}

	addCharacterElement(count, value = 'Character_' + count) {
		$('#characters').append(`
	<div id="character-div-${count}" class="form-group">
		<div class="input-group">
			<label class="form-control bg-light">
				${value}
			</label>
			<div class="input-group-append">
				<button type="button" id="character-show-${count}" class="btn btn-outline-secondary">
					<i class="fas fa-eye"></i>
				</button>
				<button type="button" id="character-edit-${count}" class="btn btn-outline-secondary">
					<i class="fas fa-wrench"></i>
				</button>
				<button type="button" id="character-remove-${count}" class="btn btn-outline-danger">
					<i class="fas fa-backspace"></i>
				</button>
			</div>
		</div>
	</div>
		`);
		$('#character-show-' + count).click(count, (event) => {
			router.navigate('character;view;' + count);
		});
		$('#character-edit-' + count).click(count, (event) => {
			router.navigate('character;edit;' + count);
		});
		$('#character-remove-' + count).click(count, (event) => {
			$('#character-div-' + event.data).remove();
			library.getCurrentBook().data.characters[event.data] = {};
		});
	}
}

function isEmpty(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

module.exports = {
	page: CharacterMain,
	html: `
<button type="button" id="add" class="btn btn-secondary float-right mt-2">
	<i class="fas fa-user-plus"></i>
	${translate.get('character-main-addBtn')}
</button>
<h1>${translate.get('character-main-header')}</h1>
<hr>
<form>
	<h4>${translate.get('character-main-character')}:</h4>
	<div id="characters"></div>
	<button type="button" id="add2" class="btn btn-block btn-outline-success">
		<i class="fas fa-plus"></i>
		${translate.get('character-main-addBtn')}
	</button>
</form>

<div class="modal fade" id="delete-modal" tabindex="-1" role="dialog" aria-labelledby="deleteModalHeader" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="deleteModalHeader">
					${translate.get('character-main-delete-header')}
				</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<i class="fas fa-times"></i>
				</button>
			</div>
			<div class="modal-body">
				${translate.get('character-main-delete-body')}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">
					<i class="fas fa-arrow-left"></i>
					${translate.get('general-back')}
				</button>
				<button type="button" id="delete-" class="btn btn-danger">
					<i class="fas fa-trash-alt"></i>
					${translate.get('character-main-delete-button')}
				</button>
			</div>
		</div>
	</div>
</div>
	`
};
