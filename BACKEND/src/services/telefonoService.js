// Capa de servicios: logica de negocio de Telefono.
const telefonoModel = require('../models/telefonoModel');
const Telefono = require('../models/entities/Telefono');
const { crearError } = require('../utils/helpers');

// Convierte una fila de la tabla TELEFONO en una instancia de Telefono
function mapearFilaATelefono(fila) {
  return new Telefono(fila.id, fila.numero_telefono, fila.tipo_telefono, fila.USUARIO_id, fila.activo);
}

// Lista todos los telefonos registrados
async function listar() {
  const filas = await telefonoModel.obtenerTodos();
  return filas.map(mapearFilaATelefono);
}

// Lista los telefonos de un usuario especifico
async function listarPorUsuario(usuarioId) {
  const filas = await telefonoModel.obtenerPorUsuario(usuarioId);
  return filas.map(mapearFilaATelefono);
}

// Crea un nuevo telefono asociado a un usuario.
// Si el usuarioId no existe, MySQL rechaza el INSERT por la llave foranea
// y el errorHandler traduce ese error a un HTTP 400.
async function crear(datos) {
  const id = await telefonoModel.crear(datos);
  const fila = await telefonoModel.obtenerPorId(id);
  return mapearFilaATelefono(fila);
}

// Actualiza un telefono existente
async function actualizar(id, datos) {
  const filaExistente = await telefonoModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Telefono no encontrado', 404);
  }

  await telefonoModel.actualizar(id, datos);
  const filaActualizada = await telefonoModel.obtenerPorId(id);
  return mapearFilaATelefono(filaActualizada);
}

// Elimina fisicamente un telefono
async function eliminar(id) {
  const filaExistente = await telefonoModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Telefono no encontrado', 404);
  }

  await telefonoModel.eliminar(id);
}

module.exports = { listar, listarPorUsuario, crear, actualizar, eliminar };
