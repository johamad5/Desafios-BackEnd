import ProductsDaoFactory from '../factory/productsFactoy.js';
import ProductsDTO from '../DTO/productsDTO.js';
import Prods from '../models/prods.js';

export default class ProductsRepo {
	dao;

	constructor() {
		this.dao = ProductsDaoFactory.getDao();
	}

	static getInstance() {
		if (!instance) {
			instance = new ProductsRepo();
		}
		return instance;
	}

	async findProd() {
		return await this.dao.findProd();
	}

	async newProd() {
		return await this.dao.newProd();
	}

	async saveProd(data) {
		await this.dao.saveProd(data);
	}
}
