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
			let { productId, title, stock, price, thumbnail } = prod;
			productCatalog.innerHTML += `
        <tr class='producCard'>
		<td>${productId}</td>
          <td>${title}</td>
          <td>$ ${price}</td>
          <td>${stock}</td>
          <td><img class='productImage' src='${thumbnail}' /></td>
        </tr>
    `;
		});
	} else {
		productCatalog.innerHTML = `<p class='blackBox'> No tenemos productos disponibles por el momento </p>`;
	}
});

function saveProduct() {
	const product = {
		title: document.getElementById('title').value,
		category: document.getElementById('category').value,
		price: document.getElementById('price').value,
		stock: document.getElementById('stock').value,
		thumbnail: document.getElementById('thumbnail').value,
	};

	let form = document.getElementById('productForm');
	form.reset();

	socket.emit('productData', product);
	return false;
}

socket.on('chat', (normD) => {
	const dataDesnor = normalizr.denormalize(
		normD.result,
		messagesSchema,
		normD.entities
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
		(JSON.stringify(normD).length * 100) / JSON.stringify(dataDesnor).length
	).toFixed(2);

	compRatio.innerHTML = `<p class='blackBox'>El porcentaje de compresión es de ${valueCompRatio} % <p/>`;
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

//
function saveData() {
	const data = {
		correo: document.getElementById('email').value,
		avatar: document.getElementById('avatar').files,
	};
	console.log(data);
	socket.emit('usserAvatar', data);
	return false;
}

document.querySelectorAll("[type='file']").forEach(function (control) {
	control.addEventListener('change', function (ev) {
		console.log(this.id);
		document.querySelector("[for='" + this.id + "']").innerHTML =
			ev.target.files[0].name;
	});
});

// Filtros

function getAllProducts() {
	socket.emit('filterProducts', 'allProducts');
	return false;
}

function filterProducts() {
	const filterOptions = {
		category: document.getElementById('categoryFilter').value || 'undefined',
		minPrice: parseFloat(document.getElementById('minPriceFilter').value) || 0,
		maxPrice:
			parseFloat(document.getElementById('maxPriceFilter').value) || 999999999,
	};

	socket.emit('filterProducts', filterOptions);
	return false;
}
