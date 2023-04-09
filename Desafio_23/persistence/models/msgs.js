export default class Msgs {
	#alias;
	#avatar;
	#text;

	constructor({ author, text }) {
		this.alias = author.alias;
		this.avatar = author.avatar;
		this.text = text;
	}

	get alias() {
		return this.#alias;
	}
	get avatar() {
		return this.#avatar;
	}
	get text() {
		return this.#text;
	}

	set alias(alias) {
		this.#alias = alias;
	}

	set avatar(avatar) {
		this.#avatar = avatar;
	}

	set text(text) {
		this.#text = text;
	}
}
