// Capa de servicios: contiene la logica de negocio de Usuario.
// Traduce filas de la base de datos en instancias de la clase de dominio Usuario
// y coordina llamadas a otros modelos (telefonos, perfiles sociales) cuando se
// necesita el detalle completo de un usuario.
const usuarioModel = require('../models/usuarioModel');
const telefonoModel = require('../models/telefonoModel');
const perfilSocialModel = require('../models/perfilSocialModel');
const Usuario = require('../models/entities/Usuario');
const Telefono = require('../models/entities/Telefono');
const PerfilSocial = require('../models/entities/PerfilSocial');
const RedSocial = require('../models/entities/RedSocial');
const { calcularEdad, crearError } = require('../utils/helpers');

// Convierte una fila de la tabla USUARIO (snake_case) en una instancia de Usuario
function mapearFilaAUsuario(fila) {
  return new Usuario(
    fila.id,
    fila.primer_nombre,
    fila.segundo_nombre,
    fila.primer_apellido,
    fila.segundo_apellido,
    fila.fecha_nacimiento,
    fila.edad,
    fila.ciudad_domicilio,
    fila.estado
  );
}

// Convierte una fila de la tabla TELEFONO en una instancia de Telefono
function mapearFilaATelefono(fila) {
  return new Telefono(fila.id, fila.numero_telefono, fila.tipo_telefono, fila.USUARIO_id, fila.activo);
}

// Lista todos los usuarios activos, sin cargar sus relaciones (vista resumen)
async function listar() {
  const filas = await usuarioModel.obtenerTodos();
  return filas.map(mapearFilaAUsuario);
}

// Obtiene el detalle completo de un usuario, incluyendo sus telefonos y perfiles sociales
async function obtenerDetalle(id) {
  const fila = await usuarioModel.obtenerPorId(id);
  if (!fila) {
    throw crearError('Usuario no encontrado', 404);
  }

  const usuario = mapearFilaAUsuario(fila);

  const filasTelefonos = await telefonoModel.obtenerPorUsuario(id);
  filasTelefonos.forEach(filaTelefono => usuario.agregarTelefono(mapearFilaATelefono(filaTelefono)));

  const filasPerfiles = await perfilSocialModel.obtenerPorUsuario(id);
  filasPerfiles.forEach(filaPerfil => {
    const redSocial = new RedSocial(filaPerfil.redSocialId, filaPerfil.redSocialNombre, filaPerfil.redSocialUrl);
    usuario.agregarPerfilSocial(new PerfilSocial(redSocial, usuario, filaPerfil.urlPerfil));
  });

  return usuario;
}

// Crea un nuevo usuario. La edad siempre se recalcula a partir de fechaNacimiento
// para que quede consistente, sin depender de lo que envie el cliente.
async function crear(datos) {
  const edad = calcularEdad(datos.fechaNacimiento);
  const id = await usuarioModel.crear({ ...datos, edad, estado: 1 });
  return obtenerDetalle(id);
}

// Actualiza un usuario existente
async function actualizar(id, datos) {
  const filaExistente = await usuarioModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Usuario no encontrado', 404);
  }

  const edad = calcularEdad(datos.fechaNacimiento);
  await usuarioModel.actualizar(id, { ...datos, edad });
  return obtenerDetalle(id);
}

// "Elimina" un usuario mediante borrado logico (estado = 0), ya que TELEFONO y
// PERFIL_SOCIAL referencian a USUARIO con ON DELETE NO ACTION.
async function eliminar(id) {
  const filaExistente = await usuarioModel.obtenerPorId(id);
  if (!filaExistente) {
    throw crearError('Usuario no encontrado', 404);
  }

  await usuarioModel.cambiarEstado(id, 0);
}

module.exports = { listar, obtenerDetalle, crear, actualizar, eliminar };
