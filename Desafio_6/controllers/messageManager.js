const { errorMonitor } = require('events');
const fs = require('fs');

class MessageManager {
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

	save(msg) {
		try {
			let arrayJSON = this.getAll();
			let date = new Date();

			arrayJSON.unshift({ date: date, ...msg });

			fs.writeFileSync(this.fileName, JSON.stringify(arrayJSON));
		} catch {
			console.log(`ERROR: No se pudo agregar el mensaje al archivo.`);
		}
	}
}

module.exports = MessageManager;
