const path = require('path');

class Library {
	constructor(folder) {
		this.basepath = folder
	}

	getBooks() {
		return []; //TODO return list from all books on disk
	}

	addBook(name) {
		return new Book(path.join(this.basepath, name), {
			characters: [],
			locations: [],
			items: [],
			chapters: {}
		}); //TODO save book to disk
	}

	loadBook(name) {
		return {}; //TODO load book from disk
	}
}

class Book {
	constructor(path, data) {
		this.path = path;
		this.data = data;
	}

	addCharacter() {
		return this.data.characters.push({
			data: [],
			abilities: [],
			items: [],
			relations: []
		}) -1;
	}

	addCharacterData(character, name, type, value = '') {
		return this.data.characters[character].data.push({
			name: name,
			type: type,
			value: value
		}) -1;
	}

	addCharacterAbility(character, name, strength = 0) {
		return this.data.characters[character].abilities.push({
			name: name,
			strength: strength
		}) -1;
	}

	addCharacterItem(character, name, count = 1) {
		return this.data.characters[character].items.push({
			name: name,
			count: count
		}) -1;
	}
}

module.exports = { Library, Book };
