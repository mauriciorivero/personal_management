// Capa de acceso a datos (DAO) para la tabla USUARIO.
// Solo ejecuta SQL parametrizado (previene inyeccion SQL) y devuelve filas planas.
// No conoce reglas de negocio: eso corresponde a services/usuarioService.js.
const { pool } = require('../config/database');

// Obtiene todos los usuarios. Por defecto solo trae los activos (estado = 1),
// ya que el borrado de usuarios es logico (ver PERFIL_SOCIAL/TELEFONO con ON DELETE NO ACTION).
async function obtenerTodos({ soloActivos = true } = {}) {
  const sql = soloActivos
    ? 'SELECT * FROM USUARIO WHERE estado = 1 ORDER BY id DESC'
    : 'SELECT * FROM USUARIO ORDER BY id DESC';
  const [filas] = await pool.query(sql);
  return filas;
}

// Busca un usuario por su id. Devuelve undefined si no existe.
async function obtenerPorId(id) {
  const [filas] = await pool.query('SELECT * FROM USUARIO WHERE id = ?', [id]);
  return filas[0];
}

// Inserta un nuevo usuario y devuelve el id autogenerado
async function crear(datos) {
  const sql = `
    INSERT INTO USUARIO
      (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, edad, ciudad_domicilio, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const parametros = [
    datos.primerNombre,
    datos.segundoNombre || null,
    datos.primerApellido,
    datos.segundoApellido || null,
    datos.fechaNacimiento,
    datos.edad,
    datos.ciudadDomicilio,
    datos.estado ?? 1
  ];

  const [resultado] = await pool.query(sql, parametros);
  return resultado.insertId;
}

// Actualiza los datos de un usuario existente por id
async function actualizar(id, datos) {
  const sql = `
    UPDATE USUARIO
    SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?,
        fecha_nacimiento = ?, edad = ?, ciudad_domicilio = ?
    WHERE id = ?
  `;
  const parametros = [
    datos.primerNombre,
    datos.segundoNombre || null,
    datos.primerApellido,
    datos.segundoApellido || null,
    datos.fechaNacimiento,
    datos.edad,
    datos.ciudadDomicilio,
    id
  ];

  const [resultado] = await pool.query(sql, parametros);
  return resultado.affectedRows;
}

// Cambia el estado (1 = activo, 0 = inactivo) de un usuario. Se usa para el borrado logico.
async function cambiarEstado(id, estado) {
  const [resultado] = await pool.query('UPDATE USUARIO SET estado = ? WHERE id = ?', [estado, id]);
  return resultado.affectedRows;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, cambiarEstado };
