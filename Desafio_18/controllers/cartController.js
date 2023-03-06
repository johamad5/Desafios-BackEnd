import { cartModels } from '../models/cart.js';
import { logger } from '../logs/loger.js';
import { UserController } from '../controllers/usersController.js';
import { Controller } from '../controllers/productsController.js';

const productDB = new Controller();
const userDB = new UserController();

export class CartController {
	constructor(cartModels, userDB, productDB) {
		this.product = cartModels;
		this.userDB = userDB;
		this.productDB = productDB;
	}

	async getAll() {
		const data = await cartModels.find();
		return data;
	}

	async getForId(cartId) {
		const data = await cartModels.findOne({ _id: cartId });
		return data;
	}

	async create(email) {
		const newCart = new cartModels();

		newCart.userId = '64054b627249c625509b8e10';
		newCart.userEmail = email;
		newCart.products = [];

		await newCart.save();
		return newCart._id;
	}

	async associateCart(email, userId) {
		await cartModels.updateOne({ userEmail: email }, { $set: { userId } });
	}

	async getOne(email) {
		const user = await userDB.getOne(email);
		const cart = await this.getForId(user.cartId);

		if (cart.products.length >= 1) {
			const data = await cartModels.findOne({ userEmail: email });
			return data;
		} else {
			return 'Su carrito está vacío. Agregue productos para verlo.';
		}
	}

	async saveProduct(data) {
		const user = await userDB.getOne(data.userEmail);
		const product = await productDB.getForId(data.producId);
		const myCart = await this.getForId(user.cartId);

		const cartId = user.cartId;
		const prod = myCart.products;

		if (prod == undefined) {
			const newProduct = {
				productName: product.title,
				productPrice: product.price,
				productPhoto: product.thumbnail,
				productQuantity: data.units,
			};

			await cartModels.updateOne(
				{ _id: cartId },
				{ $set: { products: [newProduct] } }
			);
			const newCart = this.getForId(cartId);
			return newCart;
		} else {
			const newProduct = {
				productName: product.title,
				productPrice: product.price,
				productPhoto: product.thumbnail,
				productQuantity: data.units,
			};

			const updatedCart = cartModels.findByIdAndUpdate(
				cartId,
				{ $push: { products: newProduct } },
				{ strict: false },
				(err, managerparent) => {
					if (err) {
						return err.message;
					}
				}
			);
			return updatedCart;
		}
	}
}
