// Capa de acceso a datos (DAO) para la tabla PERFIL_SOCIAL.
// Es una tabla intermedia (N:M) con llave primaria compuesta (RED_SOCIAL_id, USUARIO_id).
const { pool } = require('../config/database');

// Consulta base con JOIN para traer, junto al perfil, el nombre de la red social
// y el nombre del usuario. Esto evita que el frontend tenga que pedir esos datos aparte.
const SELECT_CON_JOIN = `
  SELECT
    ps.RED_SOCIAL_id AS redSocialId,
    ps.USUARIO_id AS usuarioId,
    ps.url_perfil AS urlPerfil,
    rs.nombre AS redSocialNombre,
    rs.url AS redSocialUrl,
    u.primer_nombre AS usuarioPrimerNombre,
    u.primer_apellido AS usuarioPrimerApellido
  FROM PERFIL_SOCIAL ps
  INNER JOIN RED_SOCIAL rs ON rs.id = ps.RED_SOCIAL_id
  INNER JOIN USUARIO u ON u.id = ps.USUARIO_id
`;

// Obtiene todos los perfiles sociales registrados
async function obtenerTodos() {
  const [filas] = await pool.query(`${SELECT_CON_JOIN} ORDER BY ps.USUARIO_id DESC`);
  return filas;
}

// Obtiene los perfiles sociales de un usuario especifico
async function obtenerPorUsuario(usuarioId) {
  const [filas] = await pool.query(`${SELECT_CON_JOIN} WHERE ps.USUARIO_id = ?`, [usuarioId]);
  return filas;
}

// Busca un perfil social por su llave primaria compuesta
async function obtenerPorId(redSocialId, usuarioId) {
  const [filas] = await pool.query(`${SELECT_CON_JOIN} WHERE ps.RED_SOCIAL_id = ? AND ps.USUARIO_id = ?`, [
    redSocialId,
    usuarioId
  ]);
  return filas[0];
}

// Crea un nuevo perfil social (relacion usuario <-> red social)
async function crear(datos) {
  const sql = 'INSERT INTO PERFIL_SOCIAL (RED_SOCIAL_id, USUARIO_id, url_perfil) VALUES (?, ?, ?)';
  await pool.query(sql, [datos.redSocialId, datos.usuarioId, datos.urlPerfil || null]);
}

// Actualiza la url de un perfil social existente (la llave compuesta no cambia)
async function actualizar(redSocialId, usuarioId, urlPerfil) {
  const sql = 'UPDATE PERFIL_SOCIAL SET url_perfil = ? WHERE RED_SOCIAL_id = ? AND USUARIO_id = ?';
  const [resultado] = await pool.query(sql, [urlPerfil, redSocialId, usuarioId]);
  return resultado.affectedRows;
}

// Elimina un perfil social por su llave primaria compuesta
async function eliminar(redSocialId, usuarioId) {
  const sql = 'DELETE FROM PERFIL_SOCIAL WHERE RED_SOCIAL_id = ? AND USUARIO_id = ?';
  const [resultado] = await pool.query(sql, [redSocialId, usuarioId]);
  return resultado.affectedRows;
}

module.exports = { obtenerTodos, obtenerPorUsuario, obtenerPorId, crear, actualizar, eliminar };
