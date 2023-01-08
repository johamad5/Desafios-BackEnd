const socket = io();

socket.on('connection', () => {
	console.log('Its alive');
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

socket.on('chat', (msgs) => {
	const chatView = document.getElementById('chat');
	chatView.innerHTML = ``;

	if (msgs.length >= 1) {
		msgs.map((msg) => {
			let { email, message, date } = msg;
			chatView.innerHTML += `
			<div class='msg'>
				<p><strong>👤 ${email} </strong >-  ${message} <br><br> <em> ${date} </em></p>
			</div>
				`;
		});
	} else {
		chatView.innerHTML += `<p class='blackBox'> El chat no ha iniciado</p>`;
	}
});

function sendMsg() {
	const msg = {
		email: document.getElementById('email').value,
		message: document.getElementById('msg').value,
		date: new Date().toLocaleDateString(),
	};

	socket.emit('usserMsg', msg);
	return false;
}
