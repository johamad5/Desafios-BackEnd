import fs from 'fs';
import { logger } from '../../logs/loger.js';
import { transformToDTO } from '../DTO/messagesDTO.js';

export default class MessagesDaoFile {
	constructor(route) {
		this.route = route;
	}

	static getInstance() {
		if (!instance) {
			instance = new MessagesDaoFile();
		}
		return instance;
	}

	connect() {
		logger.info('FileSystem DB connected');
	}

	disconnect() {
		logger.info('FileSystem DB diconnected');
	}

	async readFile() {
		let arrayJSON = JSON.parse(await fs.promises.readFile(this.route, 'utf-8'));
		return transformToDTO(arrayJSON);
	}

	async readCompleteFile() {
		return JSON.parse(await fs.promises.readFile(this.route, 'utf-8'));
	}

	async writeFile(data) {
		return await fs.promises.writeFile(this.route, JSON.stringify(data));
	}
}
