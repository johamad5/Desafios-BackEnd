const socket = io();

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
