import {
	getData,
	getDataById,
	createProduct,
	saveData,
	updateProdById,
	deleteProdById,
} from '../services/products.js';
import { logger } from '../logs/loger.js';

export const getAll = async (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - /products`);

	const data = await getData();
	ctx.response.status = 200;
	ctx.body = {
		status: 'succes',
		message: data,
	};
};

export const getOneById = async (ctx) => {
	const id = ctx.request.params.id;
	const prod = await getDataById(id);
	logger.info(`Petición recibida por el servidor. GET - /products/${id}`);

	if (prod.length === 0) {
		ctx.response.status = 404;
		ctx.body = {
			status: 'error',
			message: `ERROR: No tenemos un producto con el ID = ${id}`,
		};
	} else {
		ctx.response.status = 200;
		ctx.body = prod;
	}
};

export const save = async (ctx) => {
	logger.info(`Petición recibida por el servidor. POST - /products`);
	const object = ctx.request.body;
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

	ctx.response.status = 201;
	ctx.body = {
		status: 'succes',
		message: newProduct,
	};
};

export const updateById = async (ctx) => {
	const id = ctx.params.id;
	const data = ctx.body;
	logger.info(`Petición recibida por el servidor. PATCH - /products/${id}`);

	const prod = await updateProdById(id, data);
	ctx.response.status = 201;
	ctx.body = {
		status: 'succes',
		message: prod,
	};
};

export const deleteById = async (ctx) => {
	const id = ctx.params.id;
	const prod = await deleteProdById(id);
	logger.info(`Petición recibida por el servidor. DETELE - /products/${id}`);

	ctx.response.status = 204;
	ctx.body = {
		status: 'succes',
		message: prod,
	};
};
