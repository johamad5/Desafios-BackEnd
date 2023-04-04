import { logger } from '../logs/loger.js';
import { datosServer } from '../services/others.js';

export const redirectLogin = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.redirect(`/login`);
};

export const info = async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	const datos = await datosServer();
	res.send(datos);
};

export const undefinedRoutes = (req, res) => {
	const { url, method } = req;
	logger.warn();
	`Petición recibida por el servidor. Ruta ${method} - ${url} inexistente`;

	res.status(404).send('ERROR: Ruta no existente');
};
