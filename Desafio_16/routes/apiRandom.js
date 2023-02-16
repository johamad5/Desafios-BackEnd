import { Router } from 'express';
import { logger } from '../logs/loger.js';
const apiRadom = Router();

apiRadom.get('/', (req, res) => {
	const { url, method } = req;
	const cantidad = Number(req.query.cant) || 300000;
	logger.info(`Petición recibida por el servidor. Ruta ${method} - ${url}`);

	function calculoFork(cantidad) {
		const nums = [];
		for (let index = 0; index < cantidad; index++) {
			nums[index] = Math.floor(Math.random() * 1000) + 1;
		}
		let objNumeros = nums.reduce((randomCount, currentValue) => {
			return (
				randomCount[currentValue]
					? ++randomCount[currentValue]
					: (randomCount[currentValue] = 1),
				randomCount
			);
		}, {});
		return objNumeros;
	}

	res.send(calculoFork(cantidad));
});

export default apiRadom;
