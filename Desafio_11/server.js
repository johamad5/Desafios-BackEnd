//Servidor Express basico
import express from 'express';
const app = express();
const PORT = 8080;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Bases de datos
import { Controller } from './dbController.js';
import { optionsMariaDB } from './options/oMariaDB.js';
const productsDB = new Controller(optionsMariaDB, 'stock');
//quitar opciones sql3
import { optionsSQLite } from './options/oSQLite3.js';
const msgsDB = new Controller(optionsSQLite, 'messages');

import { createMessagesTable, createProductsTable } from './databaseCreator.js';

//Implementacion
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

//Configuracion del motor de plantillas
app.set('view engine', 'ejs');

// API products
import { getProducts } from './API/apiProductMock.js';

//Manejador de msg
import { MsgContenedor } from './msgController.js';
import { Console } from 'console';
const msgC = new MsgContenedor('msg');

//Rutas
app.get('/', (req, res) => {
	res.render(`pages/main.ejs`, {
		title: 'Listado',
	});
});

app.get('/api/productos-test', async (req, res) => {
	res.render(`pages/test.ejs`, {
		title: 'Listado random',
	});
});

//
io.on('connection', async (socket) => {
	// Creo las bases de datos si no existen al iniciar el servidor
	(async () => {
		await createMessagesTable();
		await createProductsTable();
	})();

	let products = await productsDB.getAll();
	let msgs = await msgC.getAllnormMsgs();
	console.log(msgs);
	let prodsRandom = getProducts(5);

	io.sockets.emit('chat', msgs);
	io.sockets.emit('producsList', products);
	io.sockets.emit('producsRandom', prodsRandom);

	socket.on('productData', async (data) => {
		const productToAdd = await productsDB.save(data);
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
	console.log(`Servidor HTTP escuchando`);
});
