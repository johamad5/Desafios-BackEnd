import { getData, createProduct, saveData } from '../services/products.js';

export class ProdsController {
	constructor(productModels) {
		this.product = productModels;
	}

	async getAll() {
		return await getData();
	}

	async save(object) {
		const products = await this.getAll();
		const newID = products.length + 1 || 1;

		const newProduct = await createProduct();

		let { title, category, price, stock, thumbnail } = object;
		(newProduct.productId = newID),
			(newProduct.title = title),
			(newProduct.category = category || 'undefined'),
			(newProduct.price = price),
			(newProduct.stock = stock || 0),
			(newProduct.thumbnail = thumbnail),
			await saveData(newProduct);

		return newProduct;
	}
}
