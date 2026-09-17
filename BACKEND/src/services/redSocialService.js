// Capa de servicios: logica de negocio de RedSocial.
const redSocialModel = require('../models/redSocialModel');
const RedSocial = require('../models/entities/RedSocial');
const { crearError } = require('../utils/helpers');

// Convierte una fila de la tabla RED_SOCIAL en una instancia de RedSocial
function mapearFilaARedSocial(fila) {
  return new RedSocial(fila.id, fila.nombre, fila.url);
}

// Lista todas las redes sociales del catalogo
async function listar() {
  const filas = await redSocialModel.obtenerTodos();
  return filas.map(mapearFilaARedSocial);
}

// Crea una nueva red social
async function crear(datos) {
  const id = await redSocialModel.crear(datos);
  const fila = await redSocialModel.obtenerPorId(id);
  return mapearFilaARedSocial(fila);
}

// Actualiza una red social existente
async function actualizar(id, datos) {
  const filaExistente = await redSocialModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Red social no encontrada', 404);
  }

  await redSocialModel.actualizar(id, datos);
  const filaActualizada = await redSocialModel.obtenerPorId(id);
  return mapearFilaARedSocial(filaActualizada);
}

// Elimina una red social. Si tiene perfiles sociales asociados, el errorHandler
// traducira el error de llave foranea de MySQL en un HTTP 409.
async function eliminar(id) {
  const filaExistente = await redSocialModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Red social no encontrada', 404);
  }

  await redSocialModel.eliminar(id);
}

module.exports = { listar, crear, actualizar, eliminar };
