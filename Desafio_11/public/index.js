const socket = io();

const authorSchema = new normalizr.schema.Entity(
	'author',
	{},
	{ idAttribute: 'id' }
);
const msgSchema = new normalizr.schema.Entity(
	'msg',
	{ author: authorSchema },
	{ idAttribute: 'datatime' }
);
const messagesSchema = new normalizr.schema.Entity('mensajes', {
	msg: [msgSchema],
});

socket.on('producsRandom', (data) => {
	let productsRandomsArea = document.getElementById('producsTest');

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

socket.on('chat', (normD) => {
	let normData = normD;

	const dataDesnor = normalizr.denormalize(
		normData.result,
		messagesSchema,
		normData.entities
	);

	const chatView = document.getElementById('chat');
	chatView.innerHTML = ``;

	if (dataDesnor.msg.length >= 1) {
		dataDesnor.msg.map((msg) => {
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

	const valueCompRatio = (
		100 -
		(JSON.stringify(normData).length * 100) / JSON.stringify(dataDesnor).length
	).toFixed(2);

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
		datatime: new Date(),
	};

	socket.emit('usserMsg', msg);
	return false;
}
