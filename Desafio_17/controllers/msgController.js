import fs from 'fs';
import { logger } from '../logs/loger.js';

export class MsgContenedor {
	constructor(fileName) {
		this.fileName = `./${fileName}.json`;
	}

	async save(msg) {
		try {
			let arrayJSON = await this.getAll();
			arrayJSON.unshift(msg);
			await fs.promises.writeFile(this.fileName, JSON.stringify(arrayJSON));

			console.log(`SUCCESS: El mensaje se agregó correctamente al archivo`);
		} catch {
			logger.error(`No se pudo agregar el mensaje al archivo.`);
		}
	}

	async getAll() {
		try {
			let array = await fs.promises.readFile(`${this.fileName}`, 'utf-8');

			let arrayJSON = JSON.parse(array);
			console.log('SUCCESS:');
			return arrayJSON;
		} catch {
			logger.error(`No se pudieron obtener los mensajes`);
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
