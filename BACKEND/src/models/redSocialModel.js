// Capa de acceso a datos (DAO) para la tabla RED_SOCIAL (catalogo de redes sociales).
const { pool } = require('../config/database');

// Obtiene todas las redes sociales del catalogo
async function obtenerTodos() {
  const [filas] = await pool.query('SELECT * FROM RED_SOCIAL ORDER BY nombre ASC');
  return filas;
}

// Busca una red social por su id
async function obtenerPorId(id) {
  const [filas] = await pool.query('SELECT * FROM RED_SOCIAL WHERE id = ?', [id]);
  return filas[0];
}

// Inserta una nueva red social y devuelve el id autogenerado
async function crear(datos) {
  const [resultado] = await pool.query('INSERT INTO RED_SOCIAL (nombre, url) VALUES (?, ?)', [
    datos.nombre,
    datos.url
  ]);
  return resultado.insertId;
}

// Actualiza una red social existente por id
async function actualizar(id, datos) {
  const [resultado] = await pool.query('UPDATE RED_SOCIAL SET nombre = ?, url = ? WHERE id = ?', [
    datos.nombre,
    datos.url,
    id
  ]);
  return resultado.affectedRows;
}

// Elimina una red social. Si tiene perfiles sociales asociados, MySQL rechazara
// la operacion por la llave foranea (ON DELETE NO ACTION) y el errorHandler
// traducira ese error a un HTTP 409.
async function eliminar(id) {
  const [resultado] = await pool.query('DELETE FROM RED_SOCIAL WHERE id = ?', [id]);
  return resultado.affectedRows;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
