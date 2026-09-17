// Capa de acceso a datos (DAO) para la tabla TELEFONO.
const { pool } = require('../config/database');

// Obtiene todos los telefonos registrados
async function obtenerTodos() {
  const [filas] = await pool.query('SELECT * FROM TELEFONO ORDER BY id DESC');
  return filas;
}

// Busca un telefono por su id
async function obtenerPorId(id) {
  const [filas] = await pool.query('SELECT * FROM TELEFONO WHERE id = ?', [id]);
  return filas[0];
}

// Obtiene todos los telefonos que pertenecen a un usuario especifico
async function obtenerPorUsuario(usuarioId) {
  const [filas] = await pool.query('SELECT * FROM TELEFONO WHERE USUARIO_id = ? ORDER BY id DESC', [usuarioId]);
  return filas;
}

// Inserta un nuevo telefono y devuelve el id autogenerado
async function crear(datos) {
  const sql = `
    INSERT INTO TELEFONO (numero_telefono, tipo_telefono, USUARIO_id, activo)
    VALUES (?, ?, ?, ?)
  `;
  const parametros = [datos.numeroTelefono, datos.tipoTelefono, datos.usuarioId, datos.activo ?? 1];

  const [resultado] = await pool.query(sql, parametros);
  return resultado.insertId;
}

// Actualiza un telefono existente por id
async function actualizar(id, datos) {
  const sql = `
    UPDATE TELEFONO
    SET numero_telefono = ?, tipo_telefono = ?, activo = ?
    WHERE id = ?
  `;
  const parametros = [datos.numeroTelefono, datos.tipoTelefono, datos.activo ?? 1, id];

  const [resultado] = await pool.query(sql, parametros);
  return resultado.affectedRows;
}

// Elimina fisicamente un telefono (no tiene tablas hijas que lo referencien)
async function eliminar(id) {
  const [resultado] = await pool.query('DELETE FROM TELEFONO WHERE id = ?', [id]);
  return resultado.affectedRows;
}

module.exports = { obtenerTodos, obtenerPorId, obtenerPorUsuario, crear, actualizar, eliminar };
