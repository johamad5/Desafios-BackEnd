import express from 'express';
export const app = express();

const PORT = 8080;

// Server websocket
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
export { io };

// Middleware
import { auth } from './Middleware/auth.js';
import { isValidPassword } from './Middleware/validPassword.js';

// Passport local
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session con mongo Atlas
import MongoStore from 'connect-mongo';
import session from 'express-session';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//////////////////////////
// 		Passport 		//
//////////////////////////
passport.use(
	'login',
	new LocalStrategy((username, password, done) => {
		user.findOne({ username }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				console.log('User Not Found with username ' + username);
				return done(null, false);
			}

			if (!isValidPassword(user, password)) {
				console.log('Invalid Password');
				return done(null, false);
			}

			return done(null, user);
		});
	})
);

function createHash(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use(
	'signUp',
	new LocalStrategy(
		{ passReqToCallback: true },
		(req, username, password, done) => {
			User.findOne({ username: username }, function (err, user) {
				if (err) {
					console.log('Error in SignUp: ' + err);
					return done(err);
				}

				if (user) {
					console.log('User already exists');
					return done(null, false);
				}

				const newUser = {
					username,
					password: createHash(password),
				};
				User.create(newUser, (err, userWithId) => {
					if (err) {
						console.log('Error in Saving user: ' + err);
						return done(err);
					}
					console.log(user);
					console.log('User Registration succesful');
					return done(null, userWithId);
				});
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser((username, done) => {
	user.findById(username, done);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				'mongodb+srv://jMad:Desafio12@desafio.flqrhzt.mongodb.net/?retryWrites=true&w=majority',
			mongoOptions: advancedOptions,
		}),
		secret: 'palabraEncriptadora',
		cookie: {
			httpOnly: false,
			secure: false,
			maxAge: 60000,
		},
		rolling: true,
		resave: true,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

/// RUTAS PASSPORT
import {
	getRoot,
	getLogin,
	getFailsignup,
	getSignup,
	getLogout,
	failRoute,
	postSignup,
	postLogin,
} from './routes/routesPassport.js';

// index
app.get('/', getRoot);

// login
app.get('/login', getLogin);
app.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/faillogin' }),
	postLogin
);
app.get('/faillogin', getFailsignup);

// SIGNUP
app.get('/signup', getSignup);
app.post(
	'/signup',
	passport.authenticate('signup', { failureRedirect: '/failsignup' }),
	postSignup
);
app.get('/failsignup', getFailsignup);

// logout
app.get('/logout', getLogout);

// file route
app.get('*', failRoute);

//Configuracion del motor de plantillas
app.set('view engine', 'ejs');

import { normalize, schema } from 'normalizr';

// Función para crear tabla Stock
import { createProductsTable } from './databaseCreator.js';

// Bases de datos
import { Controller } from './dbController.js';
import { optionsMariaDB } from './options/oMariaDB.js';

// Manejador de acciones sobre productos
const productsC = new Controller(optionsMariaDB, 'stock');

// Manejador de acciones sobre mensajes
import { MsgContenedor } from './msgController.js';
const msgC = new MsgContenedor('msg');

/*Manejador de acciones sobre Rutas y rutas

import {
	saveUserSession,
	showMainPage,
	showLogin,
	logoutUser,
} from './routes/routes.js';

// Rutas
// Log-in
app.get('/login', auth, showLogin);

// Home
app.post('/', saveUserSession);
app.get('/', auth, showMainPage);

// Logout
app.get('/logout', logoutUser);*/

io.on('connection', async (socket) => {
	// Creo las bases de datos si no existen al iniciar el servidor
	(async () => {
		await createProductsTable();
	})();

	let products = await productsC.getAll();
	let productsR = products.reverse();
	let msgs = await msgC.getAllnormMsgs();

	const mensajes = {
		id: 'Desafio_11',
		msg: msgs,
	};

	const authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
	const msgSchema = new schema.Entity(
		'msg',
		{ author: authorSchema },
		{ idAttribute: 'datatime' }
	);
	const messagesSchema = new schema.Entity('mensajes', {
		msg: [msgSchema],
	});

	const messagesNorm = normalize(mensajes, messagesSchema);

	io.sockets.emit('chat', messagesNorm);
	io.sockets.emit('producsList', productsR);

	socket.on('productData', async (data) => {
		await productsDB.save(data);
		let newProductList = await productsDB.getAll();
		let newProductListR = newProductList.reverse();
		io.sockets.emit('productList', newProductListR);
	});

	socket.on('usserMsg', async (data) => {
		await msgC.save(data);
		let newChat = await msgC.getAllnormMsgs();
		io.sockets.emit('chat', newChat);
	});
});

httpServer.listen(PORT, () => {
	console.log(`SERVER ON - http://localhost:${PORT}`);
});
