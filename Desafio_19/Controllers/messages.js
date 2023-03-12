import { getData, saveData } from '../services/messages.js';

export class MsgController {
	constructor(fileName) {
		this.fileName = `./${fileName}.json`;
	}

	async save(data) {
		await saveData(data, this.fileName);
	}

	async getAll() {
		return await getData(this.fileName);
	}
}
