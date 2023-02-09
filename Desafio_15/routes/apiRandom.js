import { Router } from 'express';
import { fork } from 'child_process';
import path from 'path';

const apiRadom = Router();

apiRadom.get('/', (req, res) => {
	const cant = req.query.cant || 800000000;

	const calculo = fork(path.resolve(process.cwd(), './middleware/calculo.js'));
	calculo.on('message', (result) => {
		if (result == 'listo') {
			calculo.send(cant);
		} else {
			res.json(result);
		}
	});
});

export default apiRadom;
