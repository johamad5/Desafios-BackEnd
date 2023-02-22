import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import passport from 'passport';
import {
	localSignupStategy,
	localLoginStrategy,
} from '../passport/localAuth.js';
import os from 'os';
import { logger } from '../logs/loger.js';
import compression from 'compression';

const router = Router();

passport.use('/signup', localSignupStategy);
passport.use('/login', localLoginStrategy);

router.get('/', (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.redirect(`/login`);
});

router.get('/home', authRequired, (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	const username = req.session.passport.user;
	res.render('pages/home.ejs', { title: 'Listado', username });
});

router.get('/login', authRequired, (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.redirect(`/home`);
});

router.post(
	'/login',
	passport.authenticate(localLoginStrategy, {
		successRedirect: '/home',
		failureRedirect: '/loginError',
		passReqToCallback: true,
	}),
	(req, res) => {
		const { url, method } = req;
		logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	}
);

router.get('/loginError', (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render('pages/loginError.ejs');
});

router.get('/logout', (req, res) => {
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
});

router.get('/signup', (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render('pages/signup.ejs');
});

router.post(
	'/signup',
	passport.authenticate(localSignupStategy, {
		successRedirect: '/home',
		failureRedirect: '/signupError',
		passReqToCallback: true,
	}),
	(req, res) => {
		const { url, method } = req;
		logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	}
);

router.get('/signupError', (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render('pages/signupError.ejs');
});

router.get('/api/productos-test', async (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	res.render(`pages/test.ejs`, {
		title: 'Listado random',
	});
});

router.get('/info', (req, res) => {
	const { url, method } = req;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);
	const Argumentos = process.argv.slice(2);
	const Plataforma = process.platform;
	const Version = process.version;
	const Memoria = process.memoryUsage().rss;
	const Path = process.execPath;
	const Id = process.pid;
	const Carpeta = process.cwd();
	const numCPUs = os.cpus().length;

	const datos = {
		Argumentos: Argumentos,
		Pltataforma: `Sistema operativo ( SO ) - ${Plataforma}`,
		Version: `Version de Node.js utilizada - ${Version}`,
		Memoria: `Memoria total reservada ( RSS ) - ${Memoria}`,
		Path: `Path de ejecución - ${Path}`,
		CPUs: `Cantidad de procesadores presentes en el servidor - ${numCPUs}`,
		Id: `Process ID - ${Id}`,
		Carpeta: `Carpeta del proyecto - ${Carpeta}`,
	};

	console.log('Aqui van los datos');
	console.log(datos);

	res.send(datos);
});

router.get('*', (req, res) => {
	const { url, method } = req;
	logger.warn();
	`Petición recibida por el servidor. Ruta ${method} - ${url} inexistente`;

	res.status(404).send('ERROR: Ruta no existente');
});

export { router };
