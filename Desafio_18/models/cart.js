import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	userEmail: { type: String, required: true },
	products: { type: Object },
});

export const cartModels = mongoose.model('carts', cartSchema);
