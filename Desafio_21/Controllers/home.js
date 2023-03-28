import { logger } from '../logs/loger.js';

const renderHome = (req, res) => {
	const { url, method } = req;
	const username = req.session.passport.user;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	res.render('pages/home.ejs', { title: 'Listado', username });
};

export default renderHome;
