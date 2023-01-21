import { app } from './server';
import { io } from './websockets';
import { getProducts } from './API/apiProductMock';

//Ruta Products test
app.get('/api/productos-test', async (req, res) => {
	res.render(`pages/test.ejs`, {
		title: 'Listado random',
	});
});

io.on('connection', async (socket) => {
	let prodsRandom = getProducts(5);
	io.sockets.emit('producsRandom', prodsRandom);
});
