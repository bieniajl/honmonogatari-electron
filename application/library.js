const path = require('path');

class Library {
	constructor(folder, book_name) {
		this.basepath = folder
		try {
			fs.mkdirSync(folder, { recursive: true });
		} catch (EEXIST) {}
		this.loadBook(book_name, true);
	}

	getCurrentBook() {
		return this.current_book;
	}

	getBook(name, autocreate = false) {
		let file_path = path.join(this.basepath, name);
		let data;
		try {
			data = JSON.parse(fs.readFileSync(file_path + '.json', { encoding: 'utf-8'}));
		} catch (e) {
			if (e.code === "ENOENT" && autocreate) {
				return this.addBook(name);
			} else {
				throw e;
			}
		}
		return new Book(file_path, data);
	}

	getBooks() {
		return fs.readdirSync(this.basepath).filter(file => {
			return file.endsWith(".json");
		}).map(file => {
			return file.substr(0, file.length - 5);
		});
	}

	addBook(name) {
		let book = new Book(path.join(this.basepath, name));
		book.save();
		return book;
	}

	loadBook(name, autocreate = false) {
		this.current_book = this.getBook(name, autocreate);
	}
}

class Book {
	constructor(path, data = Book.default) {
		this.path = path;
		this.data = JSON.parse(JSON.stringify(data));
	}

	getCharacter(character) {
		return new Character(this.data.characters[character]);
	}

	getCharacterTemplate(template) {
		return new Character(this.data.character_templates[template]);
	}

	addCharacter(data = Character.default) {
		return this.data.characters.push(JSON.parse(JSON.stringify(data))) -1;
	}

	addCharacterTemplate(data = Character.default) {
		return this.data.character_templates.push(JSON.parse(JSON.stringify(data))) -1;
	}

	save() {
		fs.writeFile(this.path + '.json', JSON.stringify(this.data), (error) => {
			if (error) {
				alert("Can't save file <" + this.path + ">\n" + error.message);
				console.log(error);
			}
		});
	}
}
Book.default = {
	characters: [],
	character_templates: {},
	locations: [],
	items: [],
	chapters: {}
};

class Character {
	constructor(data = { data: [], abilities: [], items: [], relations: [] }) {
		this.data = data.data;
		this.abilities = data.abilities;
		this.items = data.items;
		this.relations = data.relations;
	}

	addData(name, type, value = '') {
		return this.data.push({
			name: name,
			type: type,
			value: value
		}) -1;
	}

	addAbility(name, strength = 0) {
		return this.abilities.push({
			name: name,
			value: strength
		}) -1;
	}

	addItem(name, count = 1) {
		return this.items.push({
			name: name,
			value: count
		}) -1;
	}
}
Character.default = {
	data: [{
		name: 'Name',
		type: 'string',
		value: ""
	}],
	abilities: [],
	items: [],
	relations: []
};

module.exports = { Library, Book, Character };
