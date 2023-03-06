import { Router } from 'express';
import { logger } from '../logs/loger.js';
import { authRequired } from '../middleware/auth.js';
import { CartController } from '../controllers/cartController.js';

const cartDB = new CartController();
const cartRoutes = Router();

cartRoutes.get('/', authRequired, async (req, res) => {
	const userEmail = req.session.passport.user;
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const value = await cartDB.getOne(userEmail);

	res.send(value);
});

cartRoutes.get('/add/:producId/:cant', authRequired, async (req, res) => {
	const userEmail = req.session.passport.user;
	const data = {
		userEmail,
		producId: req.params.producId,
		units: req.params.cant,
	};
	const { url, method } = req;

	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const value = await cartDB.saveProduct(data);
	res.send(value);
});

cartRoutes.get('/checkout'.authRequired, (req, res) => {});

export { cartRoutes };
