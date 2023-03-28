export default class Prods {
	#title;
	#thumbnail;
	#price;

	constructor({ title, thumbnail, price }) {
		this.title = title;
		this.price = price;
		this.thumbnail = thumbnail;
	}

	get title() {
		return this.#title;
	}
	get price() {
		return this.#price;
	}
	get thumbnail() {
		return this.#thumbnail;
	}

	set title(title) {
		this.#title = title;
	}

	set price(price) {
		this.#price = price;
	}
	set thumbnail(thumbnail) {
		this.#thumbnail = thumbnail;
	}

	data() {
		return JSON.parse(
			JSON.stringify({
				title: this.title,
				price: this.price,
				thumbnail: this.thumbnail,
			})
		);
	}
}
