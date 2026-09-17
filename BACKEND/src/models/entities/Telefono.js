// Clase de dominio que representa un numero de telefono asociado a un Usuario.
class Telefono {
  #id;
  #numeroTelefono;
  #tipoTelefono;
  #usuario;
  #activo;

  constructor(id = null, numeroTelefono, tipoTelefono, usuario = null, activo = 1) {
    this.#id = id;
    this.#numeroTelefono = numeroTelefono;
    this.#tipoTelefono = tipoTelefono;
    this.#usuario = usuario;
    this.#activo = activo;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get numeroTelefono() {
    return this.#numeroTelefono;
  }

  set numeroTelefono(value) {
    this.#numeroTelefono = value;
  }

  get tipoTelefono() {
    return this.#tipoTelefono;
  }

  set tipoTelefono(value) {
    this.#tipoTelefono = value;
  }

  get usuario() {
    return this.#usuario;
  }

  set usuario(value) {
    this.#usuario = value;
  }

  get activo() {
    return this.#activo;
  }

  set activo(value) {
    this.#activo = value;
  }

  esActivo() {
    return this.#activo === 1;
  }

  activar() {
    this.#activo = 1;
  }

  desactivar() {
    this.#activo = 0;
  }

  // Convierte la instancia en un objeto plano listo para responder como JSON en la API
  toJSON() {
    return {
      id: this.#id,
      numeroTelefono: this.#numeroTelefono,
      tipoTelefono: this.#tipoTelefono,
      usuarioId: this.#usuario?.id ?? this.#usuario ?? null,
      activo: this.#activo
    };
  }
}

module.exports = Telefono;
