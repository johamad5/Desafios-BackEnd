import {
	getData,
	getDataById,
	createProduct,
	saveData,
	updateProdById,
	deleteProdById,
} from '../services/products.js';
import { logger } from '../logs/loger.js';

export const getAll = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const data = await getData();
	res.status(200).json(data);
};

export const getOneById = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const id = req.params.id;
	const prod = await getDataById(id);
	if (prod.length === 0) {
		res.status(404).json(`ERROR: No tenemos un producto con el ID = ${id}`);
	} else {
		res.status(200).json(prod);
	}
};

export const save = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	const object = req.body;
	const data = await getData();
	const newID = data.length + 1 || 1;
	const newProduct = await createProduct();

	let { title, category, price, stock, thumbnail } = object;

	(newProduct.productId = newID),
		(newProduct.title = title),
		(newProduct.category = category || 'undefined'),
		(newProduct.price = price),
		(newProduct.stock = stock || 0),
		(newProduct.thumbnail = thumbnail),
		await saveData(newProduct);

	res.status(201).json(newProduct);
};

export const updateById = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const id = req.params.id;
	const data = req.body;

	const prod = await updateProdById(id, data);
	res.status(201).json(prod);
};

export const deleteById = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	const id = req.params.id;
	const prod = await deleteProdById(id);
	res.status(204).json(prod);
};
