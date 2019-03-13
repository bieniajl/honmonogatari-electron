class CharacterMain {
	constructor() {
	}

	init() {
		$('#add').click(() => {
			current_book.addCharacter();
			router.navigate('character;edit;' + (current_book.data.characters.length - 1));
		});
		this.loadBook();
	}

	loadBook() {
		$('#characters').empty();

		for (let characterId in current_book.data.characters) {
			let character = current_book.data.characters[characterId];
			//if (isEmpty(character)) continue;
			let name = 'Character_' + characterId;
			//if (!isEmpty(character.data[0]))
				//name = character.data[0].name + ': ' + character.data[0].value;
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
			router.navigate('character;show;' + count);
		});
		$('#character-edit-' + count).click(count, (event) => {
			router.navigate('character;edit;' + count);
		});
		$('#character-remove-' + count).click(count, (event) => {
			$('#character-div-' + event.data).remove();
			current_book.data.characters[event.data] = {};
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
</form>
	`
};
