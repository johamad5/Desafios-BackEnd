import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { router } from './routes/routes.js';
import apiRadom from './routes/apiRandom.js';
import { normalize, schema } from 'normalizr';
import path from 'path';
import { fileURLToPath } from 'url';
import { DBconect } from './config/mongoDBconnection.js';
import { ProdsController } from './Controllers/products.js';
import { getProducts } from './API/apiProductMock.js';
import { MsgController } from './Controllers/messages.js';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';
import { logger } from './logs/loger.js';
import { mongoSession } from './config/mongoSession.js';

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
	const PORT = process.argv[3] || config.default.port;
	const httpServer = createServer(app);
	const io = new Server(httpServer, { cors: { origin: '*' } });
	const productsDB = new ProdsController();
	const msgC = new MsgController('msg');

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use('/public', express.static(__dirname + '/public'));
	app.use(cookieParser());
	app.use(session(mongoSession));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/apirandom', apiRadom);
	app.use('/', router);

	app.set('view engine', 'ejs');

	DBconect();

	io.on('connection', async (socket) => {
		let products = await productsDB.getAll();
		let prodsRandom = getProducts(5);
		let msgs = await msgC.getAll();

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

			let msgs = await msgC.getAll();

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
