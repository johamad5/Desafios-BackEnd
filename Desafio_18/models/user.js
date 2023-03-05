import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	adress: { type: String, required: true },
	age: { type: Number, required: true },
	phone: { type: Number, required: true },
	avatar: { type: String, required: true },
	admin: { type: Boolean },
});

export const userModels = mongoose.model('users', userSchema);
