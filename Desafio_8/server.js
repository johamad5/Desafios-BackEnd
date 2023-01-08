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

app.get('/', (req, res) => {
	res.render(`pages/main.ejs`, {
		title: 'Listado',
	});
});

io.on('connection', async (socket) => {
	// Creo las bases de datos si no existen al iniciar el servidor
	(async () => {
		await createMessagesTable();
		await createProductsTable();
	})();

	let products = await productsDB.getAll();
	let msgs = await msgsDB.getAll();

	io.sockets.emit('chat', msgs);
	io.sockets.emit('producsList', products);

	socket.on('productData', async (data) => {
		const productToAdd = await productsDB.save(data);
		let newProductList = await productsDB.getAll();
		let newProductListR = newProductList.reverse();
		io.sockets.emit('productList', newProductListR);
	});

	socket.on('usserMsg', async (data) => {
		const msgToAdd = await msgsDB.save(data);
		let newChat = await msgsDB.getAll();
		let newChatR = newChat.reverse();
		io.sockets.emit('chat', newChatR);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Servidor HTTP escuchando`);
});
