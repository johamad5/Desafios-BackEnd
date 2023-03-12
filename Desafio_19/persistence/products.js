import { productModels } from './models/products.js';

async function findProd() {
	return await productModels.find();
}

async function newProd() {
	return new productModels();
}

async function saveProd(data) {
	await data.save();
}
export { findProd, newProd, saveProd };
