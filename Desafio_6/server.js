const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const PORT = 8080;
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

// Objetos para el manejo de archivos
const Prods = require('./controllers/productManager');
const Msgs = require('./controllers/messageManager');
const productManager = new Prods('products');
const messageManager = new Msgs('messages');

app.get('/', (req, res) => {
	res.render(`pages/main`, {
		title: 'Listado',
	});
});

io.on('connection', (socket) => {
	let stock = productManager.getAll();
	let allMessages = messageManager.getAll();

	console.log('Un cliente se ha conectado');

	io.sockets.emit('stock', stock);
	io.sockets.emit('messages', allMessages);

	socket.on('newMessage', (data) => {
		messageManager.save(data);

		let allMessages = messageManager.getAll();
		io.sockets.emit('messages', allMessages);
	});

	socket.on('newProduct', (data) => {
		productManager.save(data);
		let newStock = productManager.getAll();

		io.sockets.emit('stock', newStock);
	});
});

httpServer.listen(PORT, function (err) {
	if (err) {
		console.error(`SERVER ERROR: ${err}`);
	}
	console.log(`ACTIVER SERVER: http://localhost:${PORT}`);
});
