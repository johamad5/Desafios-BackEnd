const fs = require('fs');

class ProductManager {
	constructor(fileName) {
		this.fileName = `./file/${fileName}.json`;
	}

	getAll() {
		try {
			let array = fs.readFileSync(this.fileName, 'utf-8');
			let arrayJSON = JSON.parse(array);

			return arrayJSON;
		} catch {
			console.log(
				`ERROR: No se pudo encontrar el contenido del archivo ${this.fileName} `
			);
		}
	}

	save(product) {
		try {
			let arrayJSON = this.getAll();
			let newID = arrayJSON.length + 1;
			console.log(`ID a asignar: ${newID}`);
			if (newID === 1) {
				let newProduct = { id: newID, ...product };

				fs.writeFileSync(this.fileName, JSON.stringify(newProduct));
			} else {
				arrayJSON.unshift({ id: newID, ...product });
				fs.writeFileSync(this.fileName, JSON.stringify(arrayJSON));
			}
		} catch {
			console.log(`ERROR: No se pudo agregar el producto al archivo.`);
		}
	}
}

module.exports = ProductManager;
