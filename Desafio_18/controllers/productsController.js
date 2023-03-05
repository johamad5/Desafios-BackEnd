import { productModels } from '../models/products.js';

export class Controller {
	constructor(productModels) {
		this.product = productModels;
	}

	async getAll() {
		const data = await productModels.find();
		return data;
	}

	async filter(object) {
		let newProductList = [];

		if (object.category === 'undefined') {
			newProductList = await productModels.find({
				$and: [
					{ price: { $gte: object.minPrice } },
					{ price: { $lte: object.maxPrice } },
				],
			});
		} else {
			newProductList = await productModels.find({
				$and: [
					{ category: { $eq: object.category } },
					{ price: { $gte: object.minPrice } },
					{ price: { $lte: object.maxPrice } },
				],
			});
		}

		return newProductList;
	}

	async save(object) {
		const products = await this.getAll();
		const newID = products.length + 1 || 1;

		const newProduct = new productModels();
		let { title, category, price, stock, thumbnail } = object;
		(newProduct.productId = newID),
			(newProduct.title = title),
			(newProduct.category = category),
			(newProduct.price = price),
			(newProduct.stock = stock),
			(newProduct.thumbnail = thumbnail),
			await newProduct.save();

		return newProduct;
	}
}
