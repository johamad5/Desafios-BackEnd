import { logger } from '../logs/loger.js';

export const redirectHome = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.redirect(`/home`);
};

export const renderLoginError = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render(`pages/loginError.ejs`);
};

export const logout = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const username = req.session.passport.user;
	req.session.destroy((err) => {
		if (err) {
			return res.send({ status: 'Logout ERROR', body: err });
		} else {
			res.render('pages/logout.ejs', { username });
		}
	});
};

export const loginPost = (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
};
