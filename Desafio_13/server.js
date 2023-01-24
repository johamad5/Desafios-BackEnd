// ---> Servidor Express basico
import express from "express";
const app = express();
const PORT = 8080;

import { normalize, schema } from "normalizr";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---> Implementacion
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// ---> Bases de datos
import { Controller } from "./dbController.js";
import { optionsMariaDB } from "./options/oMariaDB.js";
const productsDB = new Controller(optionsMariaDB, "stock");

// ---> Products con MariaDB
import { createProductsTable } from "./databaseCreator.js";

// ---> Session con MongoDB Atlas
import MongoStore from "connect-mongo";
import session from "express-session";
import { mongodb } from "./keys.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongodb.URI,
      mongoOptions: mongodb.advanceOptions,
    }),
    secret: "palabraEncriptadora",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000000,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);

// ---> Pasport
import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());

// ---> Configuracion del motor de plantillas
app.set("view engine", "ejs");

// ---> API products
import { getProducts } from "./API/apiProductMock.js";

// ---> Manejador de msg
import { MsgContenedor } from "./msgController.js";
const msgC = new MsgContenedor("msg");

// ---> NUEVAS rutas
import { router } from "./routes/routes.js";
app.use("/", router);

// ---> MongoDB conection
import { DBconect } from "./database.js";
DBconect();

// ---> Websocket
io.on("connection", async (socket) => {
  // Creo las bases de datos si no existen al iniciar el servidor
  (async () => {
    await createProductsTable();
  })();

  let products = await productsDB.getAll();
  let prodsRandom = getProducts(5);
  let msgs = await msgC.getAllnormMsgs();

  const mensajes = {
    id: "Desafio_11",
    msg: msgs,
  };

  const authorSchema = new schema.Entity("author", {}, { idAttribute: "id" });
  const msgSchema = new schema.Entity(
    "msg",
    { author: authorSchema },
    { idAttribute: "datatime" }
  );
  const messagesSchema = new schema.Entity("mensajes", {
    msg: [msgSchema],
  });

  const messagesNorm = normalize(mensajes, messagesSchema);

  io.sockets.emit("chat", messagesNorm);
  io.sockets.emit("producsList", products);
  io.sockets.emit("producsRandom", prodsRandom);

  socket.on("productData", async (data) => {
    await productsDB.save(data);
    let newProductList = await productsDB.getAll();
    io.sockets.emit("productList", newProductList);
  });

  socket.on("usserMsg", async (data) => {
    await msgC.save(data);
    let newChat = await msgC.getAllnormMsgs();
    io.sockets.emit("chat", newChat);
  });
});

httpServer.listen(PORT, () => {
  console.log(`SERVER ON - http://localhost:${PORT}`);
});
