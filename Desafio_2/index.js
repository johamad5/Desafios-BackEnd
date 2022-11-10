const fs = require("fs");

class Contenedor {
  constructor(fileName) {
    this.fileName = `./files/${fileName}.json`;
  }

  async save(product) {
    try {
      let arrayJSON = await this.getAll();
      let newID = arrayJSON.length + 1;
      console.log(`ID a asignar: ${newID}`);
      if (newID === 1) {
        let newProduct = { id: newID, ...product };

        await fs.promises.writeFile(this.fileName, JSON.stringify(newProduct));
      } else {
        arrayJSON.push({ id: newID, ...product });
        await fs.promises.writeFile(this.fileName, JSON.stringify(arrayJSON));
      }
      console.log(
        `SUCCESS: El producto se agregó correctamente al archivo y posee el ID: ${newID}`
      );
    } catch {
      console.log(`ERROR: No se pudo agregar el producto al archivo.`);
    }
  }

  async getById(id) {
    try {
      let arrayJSON = await this.getAll();
      let object = arrayJSON.find((element) => element.id === id);
      if (object !== undefined) {
        console.log(`SUCCESS: El archivo es:`);
        console.log(object);
      } else {
        console.log("Resultado de la búsqueda: NULL");
      }
    } catch {
      console.log(`ERROR: No se pudo encontrar el contenido del archivo.`);
    }
  }

  async getAll() {
    try {
      let array = await fs.promises.readFile(`${this.fileName}`, "utf-8");

      let arrayJSON = JSON.parse(array);
      console.log("SUCCESS: El contenido del archivo es:");
      console.log(arrayJSON);

      return arrayJSON;
    } catch {
      console.log(
        `ERROR: No se pudo encontrar el contenido del archivo ${this.fileName} `
      );
    }
  }

  async deleteById(id) {
    try {
      let arrayJSON = await this.getAll();

      if (arrayJSON.some((elem) => elem.id == id)) {
        let newArray = arrayJSON.filter((element) => element.id !== id);
        await fs.promises.writeFile(
          `${this.fileName}`,
          `${JSON.stringify(newArray)}`
        );
        console.log(`SUCCESS: Se eliminó el archivo con el ID: ${id}`);
      } else {
        console.log(`ERROR: No existe un archivo con el ID: ${id}`);
      }
    } catch {
      console.log(`ERROR: No se pudo eliminar el archivo con el ID: ${id}`);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(`${this.fileName}`, `${JSON.stringify([])}`);
      console.log(`SUCCESS: Se vació el archivo: ${this.fileName}`);
    } catch {
      console.log(`ERROR: No se pudo vaciar el archivo: ${this.fileName}`);
    }
  }
}

const productExample = {
  title: "Torta Brownie",
  price: 150,
  thumbnail:
    "https://firebasestorage.googleapis.com/v0/b/proyectofinal-reactjs-32aed.appspot.com/o/tortaBrownie.jpg?alt=media&token=41680a53-7089-40ee-9f42-3cfabd4686c1",
};

const object = new Contenedor("Productos");

// -----> LLAMADOS DE PRUEBA PARA CORROBORAR EL CORRECTO FUNCINAMIENTO DE LOS METODOS

//object.save(productExample);
//object.getById(3);
//object.getAll();
//object.deleteById(2);
//object.deleteAll();
