import { logger } from '../logs/loger.js';
import MessagesRepo from '../persistence/repository/messagesRepo.js';

const msgDAO = new MessagesRepo();

export async function getData() {
	try {
		return await msgDAO.readFile();
	} catch (err) {
		console.log(err);
		logger.error(`No se pudieron obtener los mensajes`);
	}
}

export async function getCompleteData() {
	try {
		return await msgDAO.readCompleteFile();
	} catch (err) {
		console.log(err);
		logger.error(`No se pudieron obtener los mensajes`);
	}
}

export async function saveData(data) {
	try {
		let arrayJSON = await getCompleteData();
		arrayJSON.unshift(data);
		await msgDAO.writeFile(arrayJSON);
	} catch {
		logger.error(`No se pudo agregar el mensaje al archivo.`);
	}
}
