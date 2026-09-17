// Funciones auxiliares reutilizables en distintas capas de la aplicacion.

// Calcula la edad (en anios cumplidos) a partir de una fecha de nacimiento.
// Se usa para que el backend siempre guarde una edad consistente con la fecha,
// sin depender de que el cliente la calcule y la envie correctamente.
function calcularEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const noHaCumplidoAnioAun =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

  if (noHaCumplidoAnioAun) {
    edad -= 1;
  }

  return edad;
}

// Construye una respuesta de error estandar para toda la API
function respuestaError(mensaje, detalles = undefined) {
  const respuesta = { error: mensaje };
  if (detalles) {
    respuesta.detalles = detalles;
  }
  return respuesta;
}

// Crea un Error "de negocio" con un codigo HTTP asociado, para que el
// middleware errorHandler sepa con que status code debe responder.
function crearError(mensaje, statusCode = 500) {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
}

module.exports = { calcularEdad, respuestaError, crearError };
