import { Router } from 'express';
import { authRequired } from './Middleware/auth.js';
import passport from 'passport';
import {
	localSignupStategy,
	localLoginStrategy,
} from '../passport/localAuth.js';
import renderHome from '../Controllers/home.js';
import { redirectLogin, info, undefinedRoutes } from '../Controllers/others.js';
import {
	redirectHome,
	renderLoginError,
	logout,
	loginPost,
} from '../Controllers/loguin.js';
import {
	renderSignupForm,
	signupPost,
	renderSignupError,
} from '../Controllers/signup.js';

const router = Router();

passport.use('/signup', localSignupStategy);
passport.use('/login', localLoginStrategy);

router.get('/login', authRequired, redirectHome);
router.post(
	'/login',
	passport.authenticate(localLoginStrategy, {
		successRedirect: '/home',
		failureRedirect: '/loginError',
		passReqToCallback: true,
	}),
	loginPost
);
router.get('/loginError', renderLoginError);
router.get('/logout', logout);
router.get('/signup', renderSignupForm);
router.post(
	'/signup',
	passport.authenticate(localSignupStategy, {
		successRedirect: '/home',
		failureRedirect: '/signupError',
		passReqToCallback: true,
	}),
	signupPost
);
router.get('/signupError', renderSignupError);
router.get('/home', authRequired, renderHome);
router.get('/', redirectLogin);
router.get('/info', info);
router.get('*', undefinedRoutes);

export { router };
