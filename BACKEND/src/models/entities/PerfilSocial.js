// Clase de dominio que representa el perfil de un Usuario en una Red Social especifica.
// Es la tabla intermedia (N:M) entre USUARIO y RED_SOCIAL, con llave primaria compuesta.
class PerfilSocial {
  #redSocial;
  #usuario;
  #urlPerfil;

  constructor(redSocial, usuario, urlPerfil = null) {
    this.#redSocial = redSocial;
    this.#usuario = usuario;
    this.#urlPerfil = urlPerfil;
  }

  get redSocial() {
    return this.#redSocial;
  }

  set redSocial(value) {
    this.#redSocial = value;
  }

  get usuario() {
    return this.#usuario;
  }

  set usuario(value) {
    this.#usuario = value;
  }

  get urlPerfil() {
    return this.#urlPerfil;
  }

  set urlPerfil(value) {
    this.#urlPerfil = value;
  }

  // Convierte la instancia en un objeto plano listo para responder como JSON en la API.
  // Si redSocial/usuario son objetos completos (vienen de un JOIN), se incluyen sus datos
  // basicos para que el frontend no tenga que hacer peticiones adicionales.
  toJSON() {
    const redSocialId = this.#redSocial?.id ?? this.#redSocial ?? null;
    const usuarioId = this.#usuario?.id ?? this.#usuario ?? null;

    return {
      redSocialId,
      usuarioId,
      urlPerfil: this.#urlPerfil,
      redSocial: this.#redSocial && typeof this.#redSocial === 'object' ? this.#redSocial.toJSON() : undefined,
      usuario: this.#usuario && typeof this.#usuario === 'object' ? this.#usuario.getNombreCompleto?.() : undefined
    };
  }
}

module.exports = PerfilSocial;
