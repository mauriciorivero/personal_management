// Capa de servicios: logica de negocio de PerfilSocial (relacion N:M Usuario <-> RedSocial).
const perfilSocialModel = require('../models/perfilSocialModel');
const PerfilSocial = require('../models/entities/PerfilSocial');
const RedSocial = require('../models/entities/RedSocial');
const Usuario = require('../models/entities/Usuario');
const { crearError } = require('../utils/helpers');

// Convierte una fila (resultado del JOIN) en una instancia de PerfilSocial,
// con la RedSocial y un Usuario "resumido" embebidos para mostrar en el frontend
// sin necesidad de peticiones adicionales.
function mapearFilaAPerfilSocial(fila) {
  const redSocial = new RedSocial(fila.redSocialId, fila.redSocialNombre, fila.redSocialUrl);
  const usuario = new Usuario(
    fila.usuarioId,
    fila.usuarioPrimerNombre,
    null,
    fila.usuarioPrimerApellido,
    null,
    null,
    null,
    null
  );

  return new PerfilSocial(redSocial, usuario, fila.urlPerfil);
}

// Lista todos los perfiles sociales
async function listar() {
  const filas = await perfilSocialModel.obtenerTodos();
  return filas.map(mapearFilaAPerfilSocial);
}

// Lista los perfiles sociales de un usuario especifico
async function listarPorUsuario(usuarioId) {
  const filas = await perfilSocialModel.obtenerPorUsuario(usuarioId);
  return filas.map(mapearFilaAPerfilSocial);
}

// Crea un nuevo perfil social. Si redSocialId o usuarioId no existen, o si ya
// existe ese mismo par (llave compuesta duplicada), el errorHandler traduce
// el error de MySQL al codigo HTTP correspondiente (400 o 409).
async function crear(datos) {
  await perfilSocialModel.crear(datos);
  const fila = await perfilSocialModel.obtenerPorId(datos.redSocialId, datos.usuarioId);
  return mapearFilaAPerfilSocial(fila);
}

// Actualiza la url de un perfil social existente
async function actualizar(redSocialId, usuarioId, urlPerfil) {
  const filaExistente = await perfilSocialModel.obtenerPorId(redSocialId, usuarioId);
  if (!filaExistente) {
    throw crearError('Perfil social no encontrado', 404);
  }

  await perfilSocialModel.actualizar(redSocialId, usuarioId, urlPerfil);
  const filaActualizada = await perfilSocialModel.obtenerPorId(redSocialId, usuarioId);
  return mapearFilaAPerfilSocial(filaActualizada);
}

// Elimina un perfil social
async function eliminar(redSocialId, usuarioId) {
  const filaExistente = await perfilSocialModel.obtenerPorId(redSocialId, usuarioId);
  if (!filaExistente) {
    throw crearError('Perfil social no encontrado', 404);
  }

  await perfilSocialModel.eliminar(redSocialId, usuarioId);
}

module.exports = { listar, listarPorUsuario, crear, actualizar, eliminar };
