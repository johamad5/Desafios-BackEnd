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

		let { title, price, thumbnail } = object;
		(newProduct.id_product = newID),
			(newProduct.title = title),
			(newProduct.price = price),
			(newProduct.thumbnail = thumbnail),
			await saveData(newProduct);

		return newProduct;
	}
}
