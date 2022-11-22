const express = require('express')
const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Establecemos el motor a utilizar y definimos las rutas de las vistas
app.set('views', './views')
app.set('view engine', 'pug')

let stock = [
    {
        id: 1,
        title: "Cupcake",
        price: 35,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fast-food-solid-tasty-happy-meal/512/Cupcake-64.png"
    },
      {
        id: 2,
        title: "Burger",
        price: 390,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fast-food-solid-tasty-happy-meal/512/Hamburger-64.png"
    },
      {
        id: 3,
        title: "Pizza",
        price: 720,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fast-food-solid-tasty-happy-meal/512/Pizza-64.png"
},
      {
        id: 4,
        title: "Papas fritas",
        price: 220,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fast-food-solid-tasty-happy-meal/512/French_fries-64.png"
    }]

app.get('/', (req, res) =>{
    res.render('form.pug', {title: 'Agregar un producto al stock'})
})

app.get('/products', (req, res) =>{
    const value = (stock.length >= 1 ? true : false)
    res.render('products.pug', {title: 'Listado de productos', list: stock, exist: value})
})

app.post('/products', (req, res) =>{
    const productData = req.body
    const id = stock.length + 1
    stock.push({id, ...productData})
    res.render('form.pug', {title: 'Producto agregado con éxito!'})
})

app.listen(PORT, function(err){
    if(err) {console.error('SERVER ERROR')}
    console.log(`ACTIVE SERVER: http://localhost:${ PORT}`)
})