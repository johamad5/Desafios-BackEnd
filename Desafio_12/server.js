//Servidor Express basico
import express from 'express';
const app = express();
const PORT = 8080;

import { normalize, schema } from 'normalizr';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Bases de datos
import { Controller } from './dbController.js';
import { optionsMariaDB } from './options/oMariaDB.js';
const productsDB = new Controller(optionsMariaDB, 'stock');

// Session con mongo Atlas
import MongoStore from 'connect-mongo';
import session from 'express-session';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

import { createProductsTable } from './databaseCreator.js';

//Implementacion
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				'mongodb+srv://jMad:Desafio12@desafio.flqrhzt.mongodb.net/?retryWrites=true&w=majority',
			mongoOptions: advancedOptions,
		}),
		secret: 'palabraEncriptadora',
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: { maxAge: 60000 },
	})
);

//Configuracion del motor de plantillas
app.set('view engine', 'ejs');

// API products
import { getProducts } from './API/apiProductMock.js';

//Manejador de msg
import { MsgContenedor } from './msgController.js';
const msgC = new MsgContenedor('msg');

// Middleware de autenticación
function auth(req, res, next) {
	const username = req.session?.username;

	if (username === null || username === undefined) {
		return res.render(`pages/login.ejs`, {});
	}
	return next();
}

//Rutas
// Log-in
app.get('/login', auth, (req, res) => {
	res.redirect(`/`);
});

// Home
app.post('/', (req, res) => {
	const username = req.body.username;
	req.session.username = username;
	res.redirect(`/`);
});

app.get('/', auth, (req, res) => {
	const username = req.session?.username;
	res.render('pages/main.ejs', { title: 'Listado', username });
});

// Logout
app.get('/logout', (req, res) => {
	const username = req.session.username;

	req.session.destroy((err) => {
		if (err) {
			return res.send({ status: 'Logout ERROR', body: err });
		} else {
			res.render('pages/logout.ejs', { username });
		}
	});
});

// Products test
app.get('/api/productos-test', async (req, res) => {
	res.render(`pages/test.ejs`, {
		title: 'Listado random',
	});
});

io.on('connection', async (socket) => {
	// Creo las bases de datos si no existen al iniciar el servidor
	(async () => {
		await createProductsTable();
	})();

	let products = await productsDB.getAll();
	let productsR = products.reverse();
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
	io.sockets.emit('producsList', productsR);
	io.sockets.emit('producsRandom', prodsRandom);

	socket.on('productData', async (data) => {
		await productsDB.save(data);
		let newProductList = await productsDB.getAll();
		let newProductListR = newProductList.reverse();
		io.sockets.emit('productList', newProductListR);
	});

	socket.on('usserMsg', async (data) => {
		await msgC.save(data);
		let newChat = await msgC.getAllnormMsgs();
		io.sockets.emit('chat', newChat);
	});
});

httpServer.listen(PORT, () => {
	console.log(`SERVER ON - http://localhost:${PORT}`);
});
