import { productModels } from "../models/products.js";

class Controller {
  constructor(productModels) {
    this.product = productModels;
  }

  async getAll() {
    const data = await productModels.find();
    return data;
  }

  async save(object) {
    const products = await this.getAll();
    const newID = products.length + 1 || 1;

    const newProduct = new productModels();
    let { title, price, thumbnail } = object;
    (newProduct.id_product = newID),
      (newProduct.title = title),
      (newProduct.price = price),
      (newProduct.thumbnail = thumbnail),
      await newProduct.save();

    return newProduct;
  }
}

export { Controller };
