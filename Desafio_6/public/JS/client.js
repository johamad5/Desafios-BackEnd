const socket = io();

function addProduct() {
	const newProduct = {
		title: document.getElementById('title').value,
		price: document.getElementById('price').value,
		thumbnail: document.getElementById('thumbnail').value,
	};
	socket.emit('newProduct', newProduct);
	return false;
}

socket.on('stock', (data) => {
	let productList = document.getElementById('productList');
	productList.innerHTML = `
		<tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Foto</th>
        </tr>
	`;

	if (data.length >= 1) {
		data.map((prod) => {
			let { title, price, thumbnail } = prod;
			productList.innerHTML += `
				<tr>
					<td> ${title} </td>
					<td> ${price} </td>
					<td> <img src='${thumbnail}' href='Product image' /> </td>
				</tr>`;
		});
	} else {
		productList.innerHTML = `<p class='blackBox'> No tenemos productos disponibles por el momento </p>`;
	}
});

function addMessage() {
	const newMessage = {
		msg: document.getElementById('text').value,
		gmail: document.getElementById('gmail').value,
	};

	socket.emit('newMessage', newMessage);
	return false;
}

socket.on('messages', (data) => {
	const chat = document.getElementById('chat');
	chat.innerHTML = ``;

	if (data.length >= 0) {
		data.map((msgs) => {
			let { gmail, date, msg } = msgs;
			chat.innerHTML += `
			<div class='msg'>
				<p>👤 ${gmail} - <strong> ${msg} </strong ><br><br> <em> ${date} </em></p>
			</div>
				`;
		});
	} else {
		chat.innerHTML = `<p class='blackBox'> El chat no ha iniciado</p>`;
	}
});
