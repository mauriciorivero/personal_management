// Clase de dominio que representa a un Usuario del sistema.
// Usa campos privados (#) para encapsular el estado y exponerlo solo
// a traves de getters/setters, siguiendo el mismo patron de js_clases/Usuario.js.
class Usuario {
  #id;
  #primerNombre;
  #segundoNombre;
  #primerApellido;
  #segundoApellido;
  #fechaNacimiento;
  #edad;
  #ciudadDomicilio;
  #estado;
  #telefonos;
  #perfilesSociales;

  constructor(
    id = null,
    primerNombre,
    segundoNombre = null,
    primerApellido,
    segundoApellido = null,
    fechaNacimiento,
    edad,
    ciudadDomicilio,
    estado = 1
  ) {
    this.#id = id;
    this.#primerNombre = primerNombre;
    this.#segundoNombre = segundoNombre;
    this.#primerApellido = primerApellido;
    this.#segundoApellido = segundoApellido;
    this.#fechaNacimiento = fechaNacimiento;
    this.#edad = edad;
    this.#ciudadDomicilio = ciudadDomicilio;
    this.#estado = estado;
    this.#telefonos = [];
    this.#perfilesSociales = [];
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get primerNombre() {
    return this.#primerNombre;
  }

  set primerNombre(value) {
    this.#primerNombre = value;
  }

  get segundoNombre() {
    return this.#segundoNombre;
  }

  set segundoNombre(value) {
    this.#segundoNombre = value;
  }

  get primerApellido() {
    return this.#primerApellido;
  }

  set primerApellido(value) {
    this.#primerApellido = value;
  }

  get segundoApellido() {
    return this.#segundoApellido;
  }

  set segundoApellido(value) {
    this.#segundoApellido = value;
  }

  get fechaNacimiento() {
    return this.#fechaNacimiento;
  }

  set fechaNacimiento(value) {
    this.#fechaNacimiento = value;
  }

  get edad() {
    return this.#edad;
  }

  set edad(value) {
    this.#edad = value;
  }

  get ciudadDomicilio() {
    return this.#ciudadDomicilio;
  }

  set ciudadDomicilio(value) {
    this.#ciudadDomicilio = value;
  }

  get estado() {
    return this.#estado;
  }

  set estado(value) {
    this.#estado = value;
  }

  get telefonos() {
    return this.#telefonos;
  }

  get perfilesSociales() {
    return this.#perfilesSociales;
  }

  // Devuelve el nombre completo concatenando solo las partes que existan
  getNombreCompleto() {
    let nombre = this.#primerNombre;
    if (this.#segundoNombre) {
      nombre += ` ${this.#segundoNombre}`;
    }
    nombre += ` ${this.#primerApellido}`;
    if (this.#segundoApellido) {
      nombre += ` ${this.#segundoApellido}`;
    }
    return nombre;
  }

  // Asocia un objeto Telefono a este usuario (relacion 1:N)
  agregarTelefono(telefono) {
    this.#telefonos.push(telefono);
  }

  // Asocia un objeto PerfilSocial a este usuario (relacion N:M via PERFIL_SOCIAL)
  agregarPerfilSocial(perfilSocial) {
    this.#perfilesSociales.push(perfilSocial);
  }

  // Filtra y devuelve solo los telefonos marcados como activos
  obtenerTelefonosActivos() {
    return this.#telefonos.filter(t => t.activo === 1);
  }

  // Convierte la instancia en un objeto plano listo para responder como JSON en la API
  toJSON() {
    return {
      id: this.#id,
      primerNombre: this.#primerNombre,
      segundoNombre: this.#segundoNombre,
      primerApellido: this.#primerApellido,
      segundoApellido: this.#segundoApellido,
      nombreCompleto: this.getNombreCompleto(),
      fechaNacimiento: this.#fechaNacimiento,
      edad: this.#edad,
      ciudadDomicilio: this.#ciudadDomicilio,
      estado: this.#estado,
      telefonos: this.#telefonos.map(t => t.toJSON()),
      perfilesSociales: this.#perfilesSociales.map(p => p.toJSON())
    };
  }
}

module.exports = Usuario;
