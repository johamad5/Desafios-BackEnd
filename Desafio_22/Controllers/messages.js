import { getData, saveData } from '../services/messages.js';

export class MsgController {
	async save(data) {
		await saveData(data);
	}

	async getAll() {
		return await getData();
	}
}
