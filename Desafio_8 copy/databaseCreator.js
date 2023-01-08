import knex from 'knex';

import { optionsMariaDB } from './options/oMariaDB.js';
const knexMariaDB = knex(optionsMariaDB);

import { optionsSQLite } from './options/oSQLite3.js';
const knexSQLite = knex(optionsSQLite);

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

const createMessagesTable = () => {
	knexSQLite.schema
		.hasTable('messages')
		.then((exist) => {
			if (!exist) {
				return knexMariaDB.schema.createTable('messages', (table) => {
					table.increments('msg_id'),
						table.string('email'),
						table.integer('message'),
						table.string('date');
				});
			}
			console.log('Tabla messages correctamente creada. ');
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			console.log('Fin.');
		});
};

export { createMessagesTable, createProductsTable };
