class CharacterMain {
	constructor() {
	}

	init() {
	}
}

module.exports = {
	page: CharacterMain,
	html: `
		<p>Main</p>
		<button type="button" class="btn" onclick="router.navigate('character;edit');">Edit</button>
	`
};
