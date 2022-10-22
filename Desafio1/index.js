class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }

  getFullName() {
    return `Mi nombrer es: ${this.nombre} ${this.apellido}.`;
  }

  addMascota(name) {
    this.mascotas.push(name);
    return `Mascota agregada con exito`;
  }

  countMascotas() {
    console.log(this.libros);
    return this.mascotas.length;
  }

  addBook(name, author) {
    this.libros.push({ nombre: name, autor: author });
    return `Libro agregado con exito`;
  }

  getBookNames() {
    let booksNames = this.libros.map((el) => el.nombre);
    return booksNames;
  }
}

const yo = new Usuario(
  "Johana",
  "Madero",
  [
    { nombre: "El profesor", autor: "John Katzenbach" },
    { nombre: "Juicio final", autor: "John Katzenbach" },
    { nombre: "El proyecto Joshua ", autor: "Sebastian Fitzek" },
  ],
  ["perro", "gato"]
);

let getFullNameMethod = yo.getFullName();
//console.log(getFullNameMethod);

let addMascotaMethod = yo.addMascota("Tortuga");
//console.log(addMascotaMethod);

let countMascotasMethod = yo.countMascotas();
//console.log(countMascotasMethod);

let addBookMethod = yo.addBook("El coleccionista", "Paul Cleave");
//console.log(addBookMethod);

let getBookNamesMethod = yo.getBookNames();
//console.log(getBookNamesMethod);
