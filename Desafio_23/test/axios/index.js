import axios from 'axios';

const URL = 'http://localhost:8080/prods/';

axios(URL)
	.then((res) => {
		const data = res.data;
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});

axios(`${URL}/19`)
	.then((res) => {
		const data = res.data;
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});

axios
	.post(URL, {
		title: 'Product-Random',
		category: 'Cascos',
		price: 666,
		stock: 5,
		thumbnail:
			'https://www.rae.es/sites/default/files/styles/wysiwyg_100_/public/2021-07/ramdomtwitter_Mesa%20de%20trabajo%201.png?itok=JfO9YVoD',
	})
	.then((res) => {
		const data = res.data;
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});

axios
	.delete(`${URL}/19`)
	.then((res) => {
		const data = res.data;
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});

axios
	.patch(`${URL}/19`, {
		title: 'Product-Edit',
		stock: 15,
	})
	.then((res) => {
		const data = res.data;
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});
