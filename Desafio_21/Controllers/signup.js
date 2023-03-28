import { logger } from '../logs/loger.js';

export const renderSignupForm = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render('pages/signup.ejs');
};

export const signupPost = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
};

export const renderSignupError = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render('pages/signupError.ejs');
};
