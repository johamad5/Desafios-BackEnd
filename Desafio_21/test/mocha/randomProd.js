import { faker } from '@faker-js/faker';

faker.locale = 'es';

const getRandomProd = () => {
	let prod = {
		title: faker.commerce.product(),
		price: faker.commerce.price(),
		stock: faker.commerce.price(),
		thumbnail: faker.image.image(),
	};
	return prod;
};

export default getRandomProd;
