import fs from 'fs';
import { normalize, schema } from 'normalizr';
import util from 'util';

function print(obj) {
	console.log(util.inspect(obj, false, 12, true));
}

class MsgContenedor {
	constructor(fileName) {
		this.fileName = `./${fileName}.json`;
	}

	#normAll(msgs) {
		this.arrayToNorm = {
			id: 'Desafio_11',
			msg: msgs,
		};

		this.authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
		this.msgSchema = new schema.Entity('msg', { author: this.authorSchema });
		this.messagesSchema = new schema.Entity('msgs', {
			msg: [this.msgSchema],
		});

		return normalize(this.arrayToNorm, this.messagesSchema);
	}

	async save(msg) {
		try {
			let arrayJSON = await this.getAll();
			arrayJSON.push({ ...msg });
			await fs.promises.writeFile(this.fileName, JSON.stringify(arrayJSON));

			console.log(`SUCCESS: El mensaje se agregó correctamente al archivo`);
		} catch {
			console.log(`ERROR: No se pudo agregar el mensaje al archivo.`);
		}
	}

	async getAll() {
		try {
			let array = await fs.promises.readFile(`${this.fileName}`, 'utf-8');

			let arrayJSON = JSON.parse(array);
			console.log('SUCCESS:');
			return arrayJSON;
		} catch {
			console.log(
				`ERROR: No se pudo encontrar el contenido del archivo ${this.fileName} `
			);
		}
	}

	async getAllnormMsgs() {
		try {
			let array = await fs.promises.readFile(`${this.fileName}`, 'utf-8');
			let arrayJSON = JSON.parse(array);

			return this.#normAll(arrayJSON);
		} catch (error) {
			console.log(`ERROR: No se pudo obtener la data normalizada`);
			console.log(error);
		}
	}
}

export { MsgContenedor };
