const express = require('express');

//Inicio de express y configuracion de servidor
const PORT = process.env.PORT || 8080;
const app = express();

//Middleware para lectura de Json desde servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion del router
const { Router } = express;
const routerCart = Router();
const routerProducts = Router();
app.use('/api/cart', routerCart);
app.use('/api/products', routerProducts);

//Middleware para acceso a carpeta public
app.use('/public', express.static(__dirname + '/public'));

//Creacion del servidor
const server = app.listen(PORT, () => {
	console.log(`Server listening on ${server.address().port}`);
});

//Variable Admins
let adminUser = true;

//Ruta de acceso a html (no necesaria para la pre-entrega 1)
app.get('/public', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

//Clases / objetos para el manejo de archivos
const Carts = require('./src/cartController');
const Products = require('./src/productsController');

const productsController = new Products('products');
const cartController = new Carts('cart');

/* Acciones con los PRODUCTOS */

routerProducts.get('/:id', (req, res) => {
	const { id } = req.params;
	let product = productsController.getByID(id);
	res.json(product);
});

routerProducts.get('/', (req, res) => {
	const { id } = req.params;
	let product = productsController.getAll();
	res.json(product);
});

routerProducts.put(
	'/:id',
	(req, res, next) => {
		if (!adminUser) {
			res.send({
				error: 'Acceso denegado',
				descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
			});
		} else {
			next();
		}
	},
	(req, res) => {
		const { id } = req.params;
		const { body } = req;
		let productUp = productsController.updateById(id, body);
		res.json(productUp);
	}
);

routerProducts.post(
	'/',
	(req, res, next) => {
		if (!adminUser) {
			res.send({
				error: 'Acceso denegado',
				descripcion: `Ruta ${req.baseUrl} método ${req.method} no autorizada`,
			});
		} else {
			next();
		}
	},
	(req, res) => {
		const { body } = req;
		let keys = Object.keys(body);
		let check = (arr, target) => target.every((e) => arr.includes(e));
		let validator = check(keys, basicStructure);

		if (validator) {
			productsController.saveProduct(body);
			let products = productsController.getAll();
			res.json(products);
		} else {
			res.json('Las props no son iguales');
		}
	}
);

routerProducts.delete(
	'/:id',
	(req, res, next) => {
		if (!adminUser) {
			res.send({
				error: 'Acceso denegado',
				descripcion: `Ruta ${req.baseUrl} método ${req.method} no autorizada`,
			});
		} else {
			next();
		}
	},
	(req, res) => {
		const { id } = req.params;
		let deletedProduct = productsController.deleteByID(id);
		res.json(deletedProduct);
	}
);

/* Acciones con LOS CARRITOS DE COMPRA */

routerCart.post('/', (req, res) => {
	let newCartId = cartController.saveCart();
	res.json(newCartId);
});

routerCart.delete('/:id', (req, res) => {
	const { id } = req.params;
	let cartList = cartController.deleteCartByID(id);
	res.json(cartList);
});

routerCart.get('/:id/productos', (req, res) => {
	const { id } = req.params;
	let cartProducts = cartController.getCartByID(id);
	res.json(cartProducts);
});

routerCart.post('/:id/productos', (req, res) => {
	const { id } = req.params;
	const { body } = req;

	let cartWithProduct = cartController.addPrductToCart(id, body);
	res.json(cartWithProduct);
});

routerCart.delete('/:id/productos/:id_prod', (req, res) => {
	const { id, id_prod } = req.params;
	let msg = cartController.removeProductFromCart(id, id_prod);
	res.json(msg);
});

/* Error generico para ruta no especificada */
app.all('*', (req, res) => {
	res.status(404).json({
		error: 'Inconsistencia',
		descripcion: `ruta: ${req.url} - método: ${req.method} no válido`,
	});
});

let basicStructure = [
	'title',
	'description',
	'code',
	'thumbnail',
	'price',
	'stock',
];
