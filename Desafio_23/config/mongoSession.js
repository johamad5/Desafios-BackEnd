import MongoStore from 'connect-mongo';
import { URImongo } from './envConfig.js';

export const mongoSession = {
	store: MongoStore.create({
		mongoUrl: URImongo,
		mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		collectionName: 'sessions',
		ttl: 600,
	}),
	secret: 'palabraEncriptadora',
	rolling: true,
	resave: false,
	saveUninitialized: false,
};
