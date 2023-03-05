import fs from 'fs';
import { logger } from '../logs/loger.js';

export class Contenedor {
	constructor(fileName) {
		this.fileName = `${fileName}.json`;
	}

	async save(data) {
		try {
			let arrayJSON = await this.getAll();
			arrayJSON.unshift(data);
			await fs.promises.writeFile(this.fileName, JSON.stringify(arrayJSON));

			logger.info(`SUCCESS: La info se agregó correctamente al archivo`);
		} catch {
			logger.error(`No se pudo agregar la info al archivo.`);
		}
	}

	async getAll() {
		try {
			let array = await fs.promises.readFile(`${this.fileName}`, 'utf-8');

			let arrayJSON = JSON.parse(array);
			console.log('SUCCESS:');
			return arrayJSON;
		} catch {
			logger.error(`No se pudo obtener la info`);
		}
	}

	async getAllnormMsgs() {
		try {
			let array = await fs.promises.readFile(`${this.fileName}`, 'utf-8');
			let arrayJSON = JSON.parse(array);

			return arrayJSON;
		} catch (error) {
			logger.error(`No se pudo obtener la data normalizada`);
		}
	}
}
