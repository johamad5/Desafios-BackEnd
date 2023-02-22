import { faker } from '@faker-js/faker';
faker.locale = 'es';

function productGenerator(id) {
	return {
		id: id,
		title: faker.commerce.productName(),
		thumbnail: faker.image.food(),
		price: faker.commerce.price(100, 800, 0),
	};
}

export function getProducts(cant) {
	const products = [];

	for (let i = 0; i < cant; i++) {
		products.push(productGenerator(i));
	}

	return products;
}
