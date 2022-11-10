const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.port || 8080;

const server = app.listen(port, () => {
  console.log("Servidor escuchando");
});

server.on("Error", (error) => console.log(`Error en servidor: ${error}`));

app.get("/productos", (petition, response) => {
  object
    .getAll()
    .then((resp) => {
      response.send(resp);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get(`/productoRandom`, (petition, response) => {
  object
    .getAll()
    .then((resp) => {
      var numeroRandom = Math.floor(Math.random() * resp.length);
      var productoRandom = resp[numeroRandom];
      response.send(productoRandom);
    })
    .catch((error) => {
      console.log(error);
    });
});

class Contenedor {
  constructor(fileName) {
    this.fileName = `./files/${fileName}.json`;
  }

  async getAll() {
    try {
      let array = await fs.promises.readFile(`${this.fileName}`, "utf-8");
      let arrayJSON = JSON.parse(array);
      console.log("SUCCESS: se encontro el archivo");
      return arrayJSON;
    } catch {
      console.log(
        `ERROR: No se pudo encontrar el contenido del archivo ${this.fileName} `
      );
    }
  }
}

const object = new Contenedor("products");