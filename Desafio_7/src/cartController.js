const fs = require('fs');

class Carts {
	constructor(fileName) {
		this.fileName = `./public/fileSystem/${fileName}.json`;
	}

	getAll() {
		try {
			let cartList = fs.readFileSync(this.fileName, 'utf-8');
			let cartListParsed = JSON.parse(cartList);
			return cartListParsed;
		} catch (error) {
			console.log(
				`ERROR: No se pudo encontrar el contenido del archivo ${this.fileName}`
			);
			console.log(`ERROR: ${error}`);
		}
	}

	saveCart() {
		try {
			let cartList = this.getAll();
			let newID = cartList.length + 1;
			console.log(newID);
			let today = new Date();
			let now = today.toLocaleString();

			if (newID == 1) {
				let newCart = { id: newID, timestamp: now, products: [] };
				fs.writeFileSync(this.fileName, JSON.stringify([newCart]));
			} else {
				cartList.unshift({ id: newID, timestamp: now, products: [] });
				fs.writeFileSync(this.fileName, JSON.stringify(cartList));
			}
			return `SUCCESS: Se creó un carrito con el ID: ${newID}`;
		} catch (error) {
			console.log(
				`ERROR: No se pudo crear el carrito en el archivo ${this.fileName}.`
			);
			console.log(`ERROR: ${error}`);
		}
	}

	deleteCartByID(id) {
		try {
			let cartList = this.getAll();
			if (cartList.some((el) => el.id == id)) {
				let newCartList = cartList.filter((el) => el.id != id);
				fs.writeFileSync(this.fileName, JSON.stringify(newCartList));
				return `SUCCESS: Se eliminó el carrito con el ID: ${id}`;
			} else {
				console.log(`ERROR: No existe un carrito con el ID: ${id}`);
			}
		} catch (error) {
			console.log(`ERROR: No se pudo eliminar el carrito con el ID: ${id}`);
			console.log(`ERROR: ${error}`);
		}
	}

	getCartByID(id) {
		try {
			let cartList = this.getAll();
			if (cartList.some((el) => el.id == id)) {
				let cart = cartList.find((el) => el.id == id);
				if (cart.products.length >= 1) {
					return { ...cart.products };
				} else {
					console.log(`ERROR: El carrito con el ID: ${id} no posee productos.`);
				}
			} else {
				console.log(`ERROR: No existe un carrito con el ID: ${id} `);
			}
		} catch (error) {
			console.log(`ERROR: No se pudo encontrar un carrito con el ID: ${id} `);
			console.log(`ERROR: ${error}`);
		}
	}

	addPrductToCart(cartId, product) {
		try {
			let cartList = this.getAll();

			if (cartList.some((el) => el.id == cartId)) {
				let cartListBeforUpdate = cartList.filter((el) => el.id != cartId);
				let cart = cartList.find((el) => el.id == cartId);
				cart.products.push(product);
				fs.writeFileSync(
					this.fileName,
					JSON.stringify([...cartListBeforUpdate, cart])
				);
				let cartListAfterUpdate = cartList.filter((el) => el.id == cartId);
				return cartListAfterUpdate;
			} else {
				console.log(`ERROR: No existe un carrito con el ID: ${cartId}`);
			}
		} catch (error) {
			console.log(`ERROR: No se pudo agregar el producto al carrito ${cartId}`);
			console.log(`ERROR: ${error}`);
		}
	}

	removeProductFromCart(cartId, productId) {
		try {
			let cartList = this.getAll();
			if (cartList.some((el) => el.id == cartId)) {
				let cartListBeforUpdate = cartList.filter((el) => el.id != cartId);
				let cart = cartList.find((el) => el.id == cartId);
				if (cart.products.some((el) => el.id == productId)) {
					cart.products = cart.products.filter((el) => el.id != productId);
					fs.writeFileSync(
						this.fileName,
						JSON.stringify([...cartListBeforUpdate, cart])
					);
					return `SUCCESS: Se elimino del carrito con el ID: ${cartId} el producto con el ID: ${productId}`;
				} else {
					console.log(
						`ERROR: No existe un producto a eliminar con el ID: ${productId}`
					);
				}
			} else {
				console.log(`ERROR: No existe un carrito con el ID: ${cartId}`);
			}
		} catch (error) {
			console.log(
				`ERROR: No se pudo eliminar el producto del carrito ${cartId}`
			);
			console.log(`ERROR: ${error}`);
		}
	}

	deleteAll() {
		try {
			fs.writeFileSync(this.fileName, JSON.stringify([]));
			console.log(`SUCCESS: Se vació el archivo: ${this.fileName}`);
		} catch (error) {
			console.log(`ERROR: No se pudo vaciar el archivo: ${this.fileName}`);
			console.log(`ERROR: ${error}`);
		}
	}
}

module.exports = Carts;
