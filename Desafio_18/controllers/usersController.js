import { userModels } from '../models/user.js';

export class UserController {
	constructor(userModels) {
		this.product = userModels;
	}

	async getAll() {
		const data = await userModels.find();
		return data;
	}

	async getForId(userId) {
		const data = await productModels.findOne({ userId: _id });
		return data;
	}

	async getOne(email) {
		const data = await userModels.findOne({ email });
		return data;
	}
}
