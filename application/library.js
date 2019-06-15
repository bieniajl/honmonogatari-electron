const path = require('path');

class Library {
	constructor(folder) {
		this.basepath = folder
		try {
			fs.mkdirSync(folder, { recursive: true });
		} catch (EEXIST) {}
	}

	getBooks() {
		return []; //TODO return list from all books on disk
	}

	addBook(name) {
		let book = new Book(path.join(this.basepath, name), {
			characters: [],
			character_templates: [],
			locations: [],
			items: [],
			chapters: {}
		});
		book.save();
		return book;
	}

	loadBook(name, autocreate = false) {
		let file_path = path.join(this.basepath, name);
		let data;
		try {
			data = JSON.parse(fs.readFileSync(file_path, { encoding: 'utf-8'}));
		} catch (e) {
			if (e.code === "ENOENT" && autocreate) {
				return this.addBook(name);
			} else {
				throw e;
			}
		}
		return new Book(file_path, data);
	}
}

class Book {
	constructor(path, data) {
		this.path = path;
		this.data = data;
	}

	getCharacter(character) {
		return this.data.characters[character];
	}

	getCharacterTemplate(template) {
		return this.data.character_templates[template];
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
			value: strength
		}) -1;
	}

	addCharacterItem(character, name, count = 1) {
		return this.data.characters[character].items.push({
			name: name,
			value: count
		}) -1;
	}

	addCharacterTemplate() {
		return this.data.character_templates.push({
			name: "New Template",
			data: [{
				name: "Name",
				type: "string",
				value: ""
			}],
			abilities: [],
			items: [],
			relations: []
		}) -1;
	}

	addCharacterTemplateData(template, name, type, value = '') {
		return this.data.character_templates[template].data.push({
			name: name,
			type: type,
			value: value
		}) -1;
	}

	addCharacterTemplateAbility(template, name, strength = 0) {
		return this.data.character_templates[template].abilities.push({
			name: name,
			value: strength
		}) -1;
	}

	addCharacterTemplateItem(template, name, count = 1) {
		return this.data.character_templates[template].items.push({
			name: name,
			value: count
		}) -1;
	}

	save() {
		fs.writeFile(this.path, JSON.stringify(this.data), (error) => {
			if (error) {
				alert("Can't save file <" + this.path + ">\n" + error.message);
				console.log(error);
			}
		});
	}
}

module.exports = { Library, Book };
