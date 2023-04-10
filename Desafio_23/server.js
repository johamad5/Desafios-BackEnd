import Koa from 'koa';
import views from 'koa-views';
import serve from 'koa-static';
import session from 'koa-session';
import { koaBody } from 'koa-body';
import passport from 'koa-passport';

import { createServer } from 'http';
import { Server } from 'socket.io';
import * as url from 'url';
import parseArgs from 'minimist';
import { logger } from './logs/loger.js';

import { mongoSession } from './config/mongoSession.js';
import { MsgController } from './Controllers/messages.js';
import { ProdsController } from './Controllers/products.js';
import loginRoutes from './routes/login.js';
import signupRoutes from './routes/signup.js';
import productRoutes from './routes/products.js';
import othersRoutes from './routes/others.js';

const config = {
	alias: {
		p: 'port',
		mf: 'msgFactory',
		pf: 'prodsFactory',
	},
	default: {
		port: 8080,
		msgFactory: 'fs',
		prodsFactory: 'mongo',
	},
};

export const { port, _, prodsFactory, msgFactory } = parseArgs(
	process.argv.slice(2),
	config
);

const app = new Koa();

const PORT = process.argv[2] || config.default.port;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const render = views(__dirname + '/view', {
	autoRender: true,
	extension: 'ejs',
});

app.keys = ['secret', 'shhh'];
app.use(render);
app.use(serve('./public'));
app.use(koaBody());
app.use(session({ maxAge: 60000 }, app));
app.use(passport.initialize());
app.use(passport.session());
app.use(loginRoutes.routes());
app.use(signupRoutes.routes());
app.use(productRoutes.routes());
app.use(othersRoutes.routes());

const httpServer = createServer(app.callback());
const io = new Server(httpServer);

const productsDB = new ProdsController();
const msgC = new MsgController();

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
	logger.info(`SERVER ON - http://localhost:${PORT}`);
});

httpServer.on('error', (err) => {
	logger.error(`Error en el servidor: ${err}`);
});
