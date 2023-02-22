import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { router } from './routes/routes.js';
import apiRadom from './routes/apiRandom.js';
import { normalize, schema } from 'normalizr';
import path from 'path';
import { fileURLToPath } from 'url';
import { DBconect } from './config/mongoDBconnection.js';
import { Controller } from './controllers/productsController.js';
import { getProducts } from './API/apiProductMock.js';
import { MsgContenedor } from './controllers/msgController.js';
import parseArgs from 'minimist';
import { URImongo } from './config/envConfig.js';
import cluster from 'cluster';
import os from 'os';
import { logger } from './logs/loger.js';

const numCPUs = os.cpus().length;

const config = {
	alias: {
		p: 'port',
		m: 'mode',
	},
	default: {
		port: 8080,
		mode: 'FORK',
	},
};

logger.warn('Este es un mensaje warn de prueba');
logger.error('Este es un mensaje error de prueba');

const { mode, port, _ } = parseArgs(process.argv.slice(2), config);

if (mode.toUpperCase() !== 'FORK' && mode.toUpperCase() !== 'CLUSTER') {
	throw Error(`The ${mode.toUpperCase()} mode is an invalid working mode.`);
}

if (mode.toUpperCase() === 'CLUSTER' && cluster.isPrimary) {
	console.log(`Primary process - PID: ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();

		cluster.on('exit', (worker, code, signal) => {
			console.log(`Worker process terminated - PID: ${worker.process.pid}`);
		});
	}
} else {
	logger.info(`El servidor se inició en modo: ${mode} - PID: ${process.pid}`);
	runServer();
}

function runServer() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const app = express();
	const PORT = process.env.PORT || 8080;
	const httpServer = createServer(app);
	const io = new Server(httpServer, { cors: { origin: '*' } });
	const productsDB = new Controller();
	const msgC = new MsgContenedor('msg');

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use('/public', express.static(__dirname + '/public'));
	app.use(cookieParser());
	app.use(
		session({
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
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/apirandom', apiRadom);
	app.use('/', router);

	app.set('view engine', 'ejs');

	DBconect();

	io.on('connection', async (socket) => {
		let products = await productsDB.getAll();
		let prodsRandom = getProducts(5);
		let msgs = await msgC.getAllnormMsgs();

		const mensajes = {
			id: 'Desafio_11',
			msg: msgs,
		};

		const authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
		const msgSchema = new schema.Entity(
			'msg',
			{ author: authorSchema },
			{ idAttribute: 'datatime' }
		);
		const messagesSchema = new schema.Entity('mensajes', {
			msg: [msgSchema],
		});

		const messagesNorm = normalize(mensajes, messagesSchema);

		io.sockets.emit('chat', messagesNorm);
		io.sockets.emit('producsList', products);
		io.sockets.emit('producsRandom', prodsRandom);

		socket.on('productData', async (data) => {
			await productsDB.save(data);
			let newProductList = await productsDB.getAll();

			io.sockets.emit('producsList', newProductList);
		});

		socket.on('usserMsg', async (data) => {
			await msgC.save(data);

			let msgs = await msgC.getAllnormMsgs();

			const mensajes = {
				id: 'Desafio_11',
				msg: msgs,
			};

			const authorSchema = new schema.Entity(
				'author',
				{},
				{ idAttribute: 'id' }
			);
			const msgSchema = new schema.Entity(
				'msg',
				{ author: authorSchema },
				{ idAttribute: 'datatime' }
			);
			const messagesSchema = new schema.Entity('mensajes', {
				msg: [msgSchema],
			});

			const messagesNorm = normalize(mensajes, messagesSchema);
			io.sockets.emit('chat', messagesNorm);
		});
	});

	httpServer.listen(PORT, () => {
		logger.info(`SERVER ON - http://localhost:${PORT} - PID: ${process.pid}`);
	});

	httpServer.on('error', (err) => {
		logger.error(`Error en el servidor: ${err}`);
	});
}
