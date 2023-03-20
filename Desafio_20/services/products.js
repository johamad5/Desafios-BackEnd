import ProductsRepo from '../persistence/repository/productsRepo.js';

const prodsDAO = new ProductsRepo();

async function getData() {
	return await prodsDAO.findProd();
}

async function createProduct() {
	return prodsDAO.newProd();
}

async function saveData(data) {
	await prodsDAO.saveProd(data);
}
export { getData, createProduct, saveData };
