const socket = io();

socket.on('connection', () => {
	console.log('Its alive');
});

socket.on('producsRandom', (data) => {
	let productsRandomsArea = document.getElementById('producsTest');
	productsRandomsArea.innerHTML = ``;

	data.map((prod) => {
		let { title, price, thumbnail } = prod;
		productsRandomsArea.innerHTML += `
	<tr class='producCard'>
	  <td>${title}</td>
	  <td>${price}</td>
	  <td><img class='producTest' src='${thumbnail}' /></td>
	</tr>
`;
	});
});

socket.on('producsList', (data) => {
	let productCatalog = document.getElementById('producCard');
	productCatalog.innerHTML = ``;

	if (data.length >= 1) {
		data.map((prod) => {
			let { title, price, thumbnail } = prod;
			producCard.innerHTML += `
        <tr class='producCard'>
          <td>${title}</td>
          <td>${price}</td>
          <td><img class='productImage' src='${thumbnail}' /></td>
        </tr>
    `;
		});
	} else {
		productList.innerHTML = `<p class='blackBox'> No tenemos productos disponibles por el momento </p>`;
	}
});

function saveProduct() {
	const product = {
		title: document.getElementById('title').value,
		price: document.getElementById('price').value,
		thumbnail: document.getElementById('thumbnail').value,
	};

	socket.emit('productData', product);
	return false;
}

socket.on('chat', (normData) => {
	const authorSchema = new normalizr.schema.Entity(
		'author',
		{},
		{ idAttribute: 'id' }
	);
	const msgSchema = new normalizr.schema.Entity('msg', {
		author: authorSchema,
	});
	const messagesSchema = new normalizr.schema.Entity('mensajes', {
		msg: [msgSchema],
	});

	const denormData = normalizr.denormalize(
		normData.result,
		messagesSchema,
		normData.entities
	);
	console.log(denormData);

	const chatView = document.getElementById('chat');
	chatView.innerHTML = ``;

	if (denormData.msg.length >= 1) {
		denormData.msg.map((msg) => {
			let text = msg.text;
			let alias = msg.author.alias;
			let url = msg.author.avatar;
			chatView.innerHTML += `
			<div class='msg'>
			<img src='${url}' class='imgChat'/>
			<p><strong>${alias} </strong >-  ${text}<br></p>
			</div>
			`;
		});
	} else {
		chatView.innerHTML += `<p class='blackBox'> El chat no ha iniciado</p>`;
	}

	const compRatio = document.getElementById('compressionRatio');

	const percentageNormData = JSON.stringify(data).length;
	const percentageDenormData = JSON.stringify(denormData).length;
	const valueCompRatio =
		100 - (percentageNormData * 100) / percentageDenormData;

	compRatio.innerHTML = `El porcentaje de compresión es de ${valueCompRatio}`;
});

function sendMsg() {
	const msg = {
		author: {
			id: document.getElementById('email').value,
			name: document.getElementById('name').value,
			surname: document.getElementById('surname').value,
			age: document.getElementById('age').value,
			alias: document.getElementById('alias').value,
			avatar: document.getElementById('avatar').value,
		},
		text: document.getElementById('msg').value,
	};

	socket.emit('usserMsg', msg);
	return false;
}
