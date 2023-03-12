import MongoStore from 'connect-mongo';
import { URImongo } from './envConfig.js';

export const mongoSession = {
	store: MongoStore.create({
		mongoUrl: URImongo,
		mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
	}),
	secret: 'palabraEncriptadora',
	cookie: {
		httpOnly: false,
		secure: false,
		maxAge: 6000000,
	},
	rolling: true,
	resave: false,
	saveUninitialized: false,
};
