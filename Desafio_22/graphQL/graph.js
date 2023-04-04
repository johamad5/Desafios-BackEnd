import { buildSchema } from 'graphql';
import { Pmodel } from './productsModel.js';

export const schemaGraphQL = buildSchema(`
    type Product {
        productId: String
        title: String
        price: Float
        thumbnail: String
    }

    input ProductInput {
        title: String
        price: Float
        thumbnail: String
    } 

    type Query {
        getProducts: [Product],
        getOneProduct(id: String!): Product
    }

    type Mutation {
        createProduct(datos: ProductInput): Product
    },
`);

const getProducts = async () => await Pmodel.find({});

const getOneProduct = async ({ id }) => {
	const prod = await Pmodel.find({ productId: id });
	return prod[0];
};
const createProduct = async (prodData) => {
	let allProds = await getProducts();
	let newId = allProds?.length + 1 || 1;

	const newProduct = new Pmodel();
	console.log(prodData);
	newProduct.productId = newId;
	newProduct.title = prodData.datos.title;
	newProduct.price = prodData.datos.price;
	newProduct.thumbnail = prodData.datos.thumbnail;
	await newProduct.save();
	return newProduct;
};

export const roots = {
	getProducts,
	getOneProduct,
	createProduct,
};
