import mongoose from 'mongoose';

const Pschema = mongoose.Schema({
	productId: { type: Number },
	title: { type: String },
	price: { type: Number },
	thumbnail: { type: String },
});

export const Pmodel = mongoose.model('productsGraphQl', Pschema);
