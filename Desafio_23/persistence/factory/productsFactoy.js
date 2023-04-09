import { logger } from '../../logs/loger.js';
import ProductsDaoMongo from '../DAO/productsDAO.js';
import { URImongo } from '../../config/envConfig.js';
import { productModels } from './models/products.js';

const advanceOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let options = 'mongo';
let dao;

switch (options) {
	case 'mongo':
		dao = new ProductsDaoMongo(URImongo, advanceOptions, productModels);
		await dao.connect();
		break;
	default:
		logger.error('Only DAO Products can be created in MongoDB');
}

export default class ProductsDaoFactory {
	static getDao() {
		return dao;
	}
}
