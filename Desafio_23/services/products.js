import ProductsRepo from '../persistence/repository/productsRepo.js';

const prodsDAO = new ProductsRepo();

async function getData() {
	return await prodsDAO.findProd();
}

async function getDataById(id) {
	return await prodsDAO.findProdById(id);
}

async function createProduct() {
	return prodsDAO.newProd();
}

async function saveData(data) {
	await prodsDAO.saveProd(data);
}

async function updateProdById(id, data) {
	await prodsDAO.updateProdById(id, data);
}

async function deleteProdById(id) {
	await prodsDAO.deleteProdById(id);
}

export {
	getData,
	getDataById,
	createProduct,
	saveData,
	updateProdById,
	deleteProdById,
};
