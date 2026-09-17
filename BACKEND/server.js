// Punto de entrada de la aplicacion: arranca el servidor HTTP y verifica
// la conexion a la base de datos.
const app = require('./src/app');
const environment = require('./src/config/environment');
const { verificarConexion } = require('./src/config/database');

const PUERTO = environment.server.port;

app.listen(PUERTO, async () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  await verificarConexion();
});
