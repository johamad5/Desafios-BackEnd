import { findProd, newProd, saveProd } from '../persistence/products.js';

async function getData() {
	return await findProd();
}

async function createProduct() {
	return newProd();
}

async function saveData(data) {
	await saveProd(data);
}
export { getData, createProduct, saveData };
