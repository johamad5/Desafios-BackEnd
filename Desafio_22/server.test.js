import { expect } from 'chai';
import axios from 'axios';
import getRandomProd from './test/mocha/randomProd.js';

const URL = 'http://localhost:8080/prods/';

describe('Testing the API product routes', () => {
	describe('GET - Obtener todos los productos', () => {
		it('Debería retornar un statusCode = 200 y un array de productos', async () => {
			const resp = await axios(URL);
			expect(resp.status).to.eql(200);
			expect(resp.data).to.be.an('array');
		});
	});

	describe('GET - Obtener un producto especifico según su ID', () => {
		it('Debería retornar un statusCode = 200 y el producto con el ID especificado', async () => {
			const resp = await axios(`${URL}/9`);
			//const prod = resp.body;
			expect(resp.status).to.eql(200);
			expect(resp.data).to.be.an('array');

			//expect(prod.data[0]).to.include.keys('id', 'title', 'price', 'thumbnail');
			//expect(prod.data[0].id).to.eql(9);
		});
	});

	describe('POST - Agregar un producto random al stock', () => {
		it('Debería retornar un statusCode = 201 y un array con el detalle del nuevo producto', async () => {
			const newProd = await getRandomProd();
			const resp = await axios.post(URL, newProd);
			//const prod = resp.body;
			//expect(prod.data[0]).to.include.keys(
			//	'_id',
			//	'productId',
			//	'title',
			//	'category',
			//	'price',
			//	'stock',
			//	'thumbnail'
			//);
			expect(resp.status).to.eql(201);
			expect(resp.data).to.be.an('object');
		});
	});

	describe(' UPDATE - Actualizar un producto especifico según su ID', () => {
		it('Debería actualizar los datos de un producto especifico y devolver un statusCode = 201', async () => {
			const newData = { title: 'Product-edit', stock: 0, price: 0 };
			const resp = await axios.patch(`${URL}/19`, newData);
			expect(resp.status).to.eql(201);
		});
	});

	describe(' DELETE - Eliminar un producto especifico según su ID', () => {
		it('Debería retornar un statusCode = 204', async () => {
			const resp = await axios.delete(`${URL}/19`);
			expect(resp.status).to.eql(204);
		});
	});
});
