const express = require('express')
const { Router } = express
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'))

const router = Router()
app.use('/api/products', router)

const PORT = 8080
const server = app.listen(PORT, (req, res) => {
    console.log(`ACTIVE SERVER  - http://localhost:${server.address().port}`)
})


server.on('error', ( error ) => {console.error(`SERVER ERROR: ${error}`)})


//Desarrollo
let stock = [
    {
      id: 1,
      title: "Alfajor de maicena",
      price: 35,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/alfajorMaicena.jpg?alt=media&token=be72972c-f44b-4464-8870-a3602e17795b",
    },
    {
      id: 2,
      title: "Budín de naranja",
      price: 190,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/budinNaranja.jpg?alt=media&token=43573676-4856-473e-a02e-e65e3fe83ba8",
    },
    {
      id: 3,
      title: "Torta frutal",
      price: 720,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/tortaFrutal.jpg?alt=media&token=ffc9ee0d-89d5-4d89-82a8-ce74f93a25ef",
    },
    {
      id: 4,
      title: "Lemon Pie",
      price: 720,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/tortaLemonPie.jpg?alt=media&token=37bd04f8-4968-43e0-b50d-295f63f6e501",
    },
    {
      id: 5,
      title: "Torta Brownie",
      price: 590,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/tortaBrownie.jpg?alt=media&token=41680a53-7089-40ee-9f42-3cfabd4686c1",
    },
    {
      id: 6,
      title: "Torta Carrot Cake",
      price: 650,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/tortaCarrotCake.jpg?alt=media&token=327e61fd-4d86-4b1c-bd42-3174b438f48e",
    },
    {
      id: 7,
      title: "Alfajor salchichon",
      price: 45,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/alfajorSalchicon.jpg?alt=media&token=b0e622ff-8718-4c4f-ac84-3979b33f179e",
    },
  ];
  
  class Products {
    constructor(products) {
      this.products = [...stock];
    }
  
    getAll() {
      return this.products;
    }
  
    getById(id) {
      return this.products.find((item) => item.id == id);
    }
  
    saveProduct(product) {
      const lastItem = this.products[this.products.length - 1];
      let lastId = 1;
      if (lastItem) {
        lastId = lastItem.id + 1;
      }
      product.id = lastId;
      this.products.push(product);
      return this.products[this.products.length - 1];
    }
  
    deleteById(id) {
      const foundProduct = this.findOne(id);
      if (foundProduct) {
        this.products = this.products.filter((item) => item.id != id);
        return id;
      }
      return undefined;
    }
  }
  
  //GET general
  router.get("/", (req, resp) => {
    const list = new Products(stock);
    resp.json(list.getAll());
  });
  
  // GET producto con ID especifico
  router.get("/:id", (req, resp) => {
    const { id } = req.params;
    let num = parseInt(id);
    const list = new Products(stock);
    let product = list.getById(num);
    if (product) {
      resp.json(product);
    } else {
      resp.json({ error: `No hay productos con el ID: ${num}` });
    }
  });
  
  // DELETE producto con ID especifico
  router.delete("/:id", (req, res) => {
    let { id } = req.params;
    const products = new Products(productsHC);
  
    id = parseInt(id);
    console.log(products.getAll());
    const deletedProduct = products.deleteById(id);
    if (deletedProduct != undefined) {
      res.json({ success: "ok", id });
    } else {
      res.json({ error: "producto no encontrado" });
    }
  });
  
  // POST producto nuevo
  router.post("/", (req, resp) => {
    const { body } = req;
    console.log(body);
    const products = new Products("Products");
    const newProduct = products.saveProduct(body);
    resp.json({ success: "ok", new: newProduct });
  });
  
  // PUT actualiza producto
  router.put("/:id", (req, res) => {
    let { id } = req.params;
    const { body } = req;
    let num = parseInt(id);
    const products = new Products(stock);
  
    const update = products.updateOne(num, body);
  
    if (update) {
      res.json({ success: "ok", new: update });
    } else {
      res.json({ error: "producto no encontrado" });
    }
  });
  
  router.get('/', function(req, res, ) {
    res.sendFile(__dirname + '/index.html')
}
)