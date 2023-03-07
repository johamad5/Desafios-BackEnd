import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModels } from '../models/user.js';
import bCrypt from 'bcrypt';
import { logger } from '../logs/loger.js';
import { CartController } from '../controllers/cartController.js';
import { createTransport } from 'nodemailer';
import { USER, PASS } from '../config/envConfig.js';

const transporter = createTransport({
	service: 'gmail',
	port: 587,
	auth: {
		user: USER,
		pass: PASS,
	},
});

const cartDB = new CartController();

function isValidPassword(user, password) {
	return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

export const localSignupStategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	async (req, email, password, done) => {
		const user = await userModels.findOne({ email: email });
		const { name, adress, age, phone, code } = req.body;

		let admin = false;
		if (code === 'DBK.JM') {
			admin = true;
		}

		const mailOptions = {
			from: 'Servidor',
			to: 'johanamadero3@gmail.com',
			subject: 'Nuevo registro de Usuario.',
			html: `<h2> Se Ha Registrado Un Nuevo Usuario en el sistema. <br/></h2>
			<h3>Datos del nuevo usuario: <h3/> <br/>
			<p>
			- Nombre: ${name} <br/>
			- Dirección: ${adress}<br/> 
			- Edad: ${age}<br/> 
			- Telefono: ${phone}
			- AdminRole: ${admin} </p>`,
		};

		console.log('mailOptions');
		console.log(mailOptions);

		if (user) {
			return done(null, false);
		} else {
			const cartIdent = await cartDB.create(email);
			const newUser = new userModels();
			newUser.name = name;
			newUser.email = email;
			newUser.password = createHash(password);
			newUser.adress = adress;
			newUser.age = age;
			newUser.phone = phone;
			newUser.avatar = `./public/uploads/${email}.jpg`;
			newUser.admin = admin;
			newUser.cartId = cartIdent;

			await newUser.save();
			logger.info('Usuario registrado con exito');
			await cartDB.associateCart(email, newUser._id);
			logger.info('Carrito asociado al usuario');

			try {
				const data = await transporter.sendMail(mailOptions);
				console.log(data);
			} catch (e) {
				logger.error(e);
			}
			done(null, newUser);
		}
	}
);

export const localLoginStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		// permite hacer uso de req para manejar datos que vegan por body
		passReqToCallback: true,
	},
	async (req, email, password, done) => {
		const user = await userModels.findOne({ email: email });

		if (!user) {
			return done(null, false);
		}

		if (!isValidPassword(user, password)) {
			return done(null, false);
		} else {
			return done(null, user);
		}
	}
);

passport.serializeUser((user, done) => {
	done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	const user = await userModels.findOne({ email: email });
	done(null, user);
});
