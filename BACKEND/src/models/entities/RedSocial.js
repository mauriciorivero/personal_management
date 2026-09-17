// Clase de dominio que representa una Red Social del catalogo (ej: Facebook, Instagram).
class RedSocial {
  #id;
  #nombre;
  #url;

  constructor(id = null, nombre, url) {
    this.#id = id;
    this.#nombre = nombre;
    this.#url = url;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get nombre() {
    return this.#nombre;
  }

  set nombre(value) {
    this.#nombre = value;
  }

  get url() {
    return this.#url;
  }

  set url(value) {
    this.#url = value;
  }

  // Convierte la instancia en un objeto plano listo para responder como JSON en la API
  toJSON() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      url: this.#url
    };
  }
}

module.exports = RedSocial;
