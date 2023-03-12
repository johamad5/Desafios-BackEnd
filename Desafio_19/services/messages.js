import { logger } from '../logs/loger.js';
import { readFile, writeFile } from '../persistence/messages.js';

export async function getData(fileName) {
	try {
		let array = await readFile(fileName);
		let arrayJSON = JSON.parse(array);
		return arrayJSON;
	} catch (err) {
		console.log(err);
		logger.error(`No se pudieron obtener los mensajes`);
	}
}

export async function saveData(data, fileName) {
	try {
		let arrayJSON = await getData(fileName);
		arrayJSON.unshift(data);
		await writeFile(fileName, arrayJSON);
	} catch {
		logger.error(`No se pudo agregar el mensaje al archivo.`);
	}
}
