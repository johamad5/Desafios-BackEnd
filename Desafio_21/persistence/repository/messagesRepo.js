import MessagesDaoFactory from '../factory/messagesFactory.js';
import MessagesDTO from '../DTO/messagesDTO.js';
import Msgs from '../models/msgs.js';

export default class MessagesRepo {
	dao;

	constructor() {
		this.dao = MessagesDaoFactory.getDao();
	}

	static getInstance() {
		if (!instance) {
			instance = new MessagesRepo();
		}
		return instance;
	}

	async readFile() {
		return await this.dao.readFile();
	}

	async readCompleteFile() {
		return await this.dao.readCompleteFile();
	}

	async writeFile(data) {
		return await this.dao.writeFile(data);
	}
}
