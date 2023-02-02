import mongoose from 'mongoose';
import { URImongo } from './envConfig.js';

const advanceOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.set('useFindAndModify', false);

export function DBconect() {
	mongoose
		.connect(URImongo, advanceOptions)
		.then((db) => {
			console.log('Connected to the database ');
		})
		.catch((err) => {
			console.error(`Error connecting to the database. ${err}`);
		});
}
