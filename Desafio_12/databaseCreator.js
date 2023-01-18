import knex from 'knex';

import { optionsMariaDB } from './options/oMariaDB.js';
const knexMariaDB = knex(optionsMariaDB);

const createProductsTable = async () => {
	await knexMariaDB.schema
		.hasTable('stock')
		.then((exist) => {
			if (!exist) {
				return knexMariaDB.schema.createTable('stock', (tbe) => {
					tbe.increments('id_product');
					tbe.string('title');
					tbe.integer('price');
					tbe.string('thumbnail');
				});
			}
			console.log('Tabla stock correctamente creada. ');
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			console.log('Fin.');
		});
};

export { createProductsTable };
