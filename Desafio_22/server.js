import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { router } from './routes/routes.js';
import productRoutes from './routes/products.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProdsController } from './Controllers/products.js';
import { MsgController } from './Controllers/messages.js';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';
import { logger } from './logs/loger.js';
import { mongoSession } from './config/mongoSession.js';
import { roots } from './graphQL/graph.js';
import { schemaGraphQL } from './graphQL/graph.js';
import { graphqlHTTP } from 'express-graphql';

const numCPUs = os.cpus().length;

const config = {
	alias: {
		p: 'port',
		m: 'mode',
		mf: 'msgFactory',
		pf: 'prodsFactory',
	},
	default: {
		port: 8080,
		mode: 'FORK',
		msgFactory: 'fs',
		prodsFactory: 'mongo',
	},
};

logger.warn('Este es un mensaje warn de prueba');
logger.error('Este es un mensaje error de prueba');

export const { mode, port, _, prodsFactory, msgFactory } = parseArgs(
	process.argv.slice(2),
	config
);

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
	const msgC = new MsgController();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use('/public', express.static(__dirname + '/public'));
	app.use(cookieParser());
	app.use(session(mongoSession));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(
		'/graphql',
		graphqlHTTP({
			schema: schemaGraphQL,
			rootValue: roots,
			graphiql: true,
		})
	);
	app.use('/prods', productRoutes);
	app.use('/', router);
	app.set('view engine', 'ejs');

	io.on('connection', async (socket) => {
		let products = await productsDB.getAll();
		let msgs = await msgC.getAll();

		io.sockets.emit('chat', msgs);
		io.sockets.emit('producsList', products);

		socket.on('productData', async (data) => {
			await productsDB.save(data);
			let newProductList = await productsDB.getAll();

			io.sockets.emit('producsList', newProductList);
		});

		socket.on('usserMsg', async (data) => {
			await msgC.save(data);

			let msgs = await msgC.getAll();
			io.sockets.emit('chat', msgs);
		});
	});

	httpServer.listen(PORT, () => {
		logger.info(`SERVER ON - http://localhost:${PORT} - PID: ${process.pid}`);
	});

	httpServer.on('error', (err) => {
		logger.error(`Error en el servidor: ${err}`);
	});
}
