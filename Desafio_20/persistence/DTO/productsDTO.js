export default class ProductsDTO {
	constructor({ title, stock, thumbnail, price }) {
		this.title = `[ ${stock} ] - ${title}`;
		this.price = price;
		this.thumbnail = thumbnail;
	}
}

export function transformToDTO(producst) {
	if (Array.isArray(producst)) {
		return producst.map((prod) => new ProductsDTO(prod));
	} else {
		return new ProductsDTO(producst);
	}
}
