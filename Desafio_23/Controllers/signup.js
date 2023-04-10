import { logger } from '../logs/loger.js';

export const renderSignupForm = async (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - /signup`);
	if (await ctx.isAuthenticated()) {
		ctx.response.redirect(`/home`);
	} else {
		await ctx.render('pages/signup');
	}
};

export const signupPost = (ctx) => {
	logger.info(`Petición recibida por el servidor. POST - /signup`);
};

export const renderSignupError = async (ctx) => {
	logger.info(`Petición recibida por el servidor. GET - signupError`);

	await ctx.render('pages/signupError');
};
