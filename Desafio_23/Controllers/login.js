import { logger } from '../logs/loger.js';
import session from 'koa-session';

export const redirectLogin = (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - /`);
	ctx.response.redirect(`/login`);
};

export const redirectHome = async (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - /login`);

	if (await ctx.isAuthenticated()) {
		ctx.response.redirect(`/home`);
	} else {
		await ctx.render(`pages/login`);
	}
};

export const renderLoginError = async (ctx) => {
	logger.info(`Petición recibida por el servidor. POST - /login`);

	await ctx.render(`pages/loginError`);
};

export const logout = async (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - /logout`);
	const username = ctx.session.passport?.user;
	if (ctx.isAuthenticated()) {
		ctx.logout();
	}

	await ctx.render('pages/logout', { username });
};

export const loginPost = async (ctx) => {
	logger.info(`Petición recibida por el servidor. POST - /login`);
	ctx.session.authenticated = true;
	ctx.redirect('/');
};
