const fs = require('fs');

class Products {
	constructor(fileName) {
		this.fileName = `./public/fileSystem/${fileName}.json`;
	}

	getAll() {
		try {
			let productList = fs.readFileSync(this.fileName, 'utf-8');
			let productListParsed = JSON.parse(productList);
			return productListParsed;
		} catch (error) {
			console.log(
				`ERROR: No se pudo encontrar el contenido del archivo ${this.fileName} `
			);
			console.log(`ERROR: ${error}`);
		}
	}

	getByID(id) {
		try {
			let productList = this.getAll();
			let product = productList.find((el) => el.id == id);
			if (product == undefined) {
				return `ERROR: No existe un producto con el ID: ${id} `;
			} else {
				return product;
			}
		} catch (error) {
			console.log(`ERROR: No se pudo encontrar el producto con el ID: ${id} `);
			console.log(`ERROR: ${error}`);
		}
	}

	saveProduct(product) {
		try {
			let productList = this.getAll();
			let newID = productList.length + 1;
			let today = new Date();
			let now = today.toLocaleString();

			if (newID === 1) {
				let newProduct = { id: newID, timestamp: now, ...product };
				fs.writeFileSync(this.fileName, JSON.stringify(newProduct));
			} else {
				productList.unshift({ id: newID, timestamp: now, ...product });
				fs.writeFileSync(this.fileName, JSON.stringify(productList));
			}
			console.log(
				`SUCCESS: El producto se agregó correctamente al archivo y posee el ID: ${newID}`
			);
		} catch (error) {
			console.log(`ERROR: No se pudo agregar el nuevo producto`);
			console.log(`ERROR: ${error}`);
		}
	}

	deleteByID(id) {
		try {
			let productList = this.getAll();
			if (productList.some((elem) => elem.id == id)) {
				let newProductList = productList.filter((elem) => elem.id != id);
				fs.writeFileSync(this.fileName, JSON.stringify(newProductList));
				console.log(`SUCCESS: Se eliminó el producto con el ID: ${id}`);
			} else {
				console.log(`ERROR: No existe un producto con el ID: ${id}`);
			}
		} catch (error) {
			console.log(`ERROR: No se pudo eliminar el producto con el ID: ${id}`);
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

	updateById(id, updaterProd) {
		try {
			let number = Number(id);
			let productList = this.getAll();
			let productListBeforeUpdate = productList.filter((el) => el.id != id);
			console.log(productListBeforeUpdate);
			let today = new Date();
			let now = today.toLocaleString();
			let productUp = { id: number, timestamp: now, ...updaterProd };
			fs.writeFileSync(
				this.fileName,
				JSON.stringify([...productListBeforeUpdate, productUp])
			);
			return `Producto actualizado`;
		} catch (error) {
			console.log(`ERROR: No se pudo actualizar el producto con el ID: ${id}`);
			console.log(`ERROR: ${error}`);
		}
	}
}

module.exports = Products;
