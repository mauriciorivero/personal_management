# 🛠️ Guía de Desarrollo

Guía técnica para desarrolladores que trabajan en el proyecto. Incluye configuración avanzada, debugging y mejores prácticas.

---

## 📋 Tabla de Contenidos

1. [Configuración del Ambiente](#configuración-del-ambiente)
2. [Debugging](#debugging)
3. [Testing Manual](#testing-manual)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Performance](#performance)
6. [Seguridad](#seguridad)
7. [Troubleshooting Avanzado](#troubleshooting-avanzado)

---

## Configuración del Ambiente

### Variables de Entorno Avanzadas

Crea un archivo `.env.development` para desarrollo:

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_management_dev
DB_USER=personal_manager
DB_PASSWORD=person_123456*

# Servidor
SERVER_PORT=3000
NODE_ENV=development

# Frontend
CORS_ORIGIN=http://localhost:8000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=combined
```

### Usar nodemon para desarrollo

```bash
# Instalar globalmente (opcional)
npm install -g nodemon

# O ejecutar con npx
npx nodemon server.js

# Reinicia automáticamente cuando detecta cambios
```

### Crear base de datos de desarrollo

```bash
# Crear base de datos separada para desarrollo
mysql -u root -p

CREATE DATABASE personal_management_dev;
CREATE USER 'personal_manager'@'localhost' IDENTIFIED BY 'person_123456*';
GRANT ALL PRIVILEGES ON personal_management_dev.* TO 'personal_manager'@'localhost';
FLUSH PRIVILEGES;

# Ejecutar el script de creación
EXIT;
mysql -u personal_manager -p personal_management_dev < DB_parametrization/DB_relational_model.sql
```

---

## Debugging

### Backend (Node.js + Express)

#### Habilitar logs detallados

En `src/app.js`, agrega:

```javascript
// Para ver todas las peticiones
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Para ver respuestas
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    console.log('Response:', data);
    originalJson.call(this, data);
  };
  next();
});
```

#### Usar Node.js Inspector

```bash
# Iniciar con inspector
node --inspect server.js

# Luego abre: chrome://inspect
# Verás una sección "Remote Target"
# Haz clic en "inspect"
```

#### Debugging de base de datos

```javascript
// En cualquier archivo de modelo, agrega console.log:
async function obtenerTodos() {
  const sql = 'SELECT * FROM USUARIO';
  console.log('SQL ejecutando:', sql); // ← Aquí ves la consulta
  const [filas] = await pool.query(sql);
  console.log('Filas retornadas:', filas); // ← Aquí ves el resultado
  return filas;
}
```

#### Debuggear errores de MySQL

```javascript
// En errorHandler.js, agrega más detalles:
function errorHandler(err, req, res, next) {
  console.error('Error completo:', {
    code: err.code,
    sqlState: err.sqlState,
    message: err.message,
    sql: err.sql,
    errno: err.errno
  });
  // ... resto del handler
}
```

### Frontend (JavaScript Vanilla)

#### Habilitar logs en la consola

```javascript
// En js/config.js, agrega:
const DEBUG = true;

function log(mensaje, dato = null) {
  if (DEBUG) {
    console.log(`[${new Date().toLocaleTimeString()}]`, mensaje, dato);
  }
}

// Luego úsalo en cualquier lugar:
async function cargar() {
  log('Iniciando carga de usuarios');
  try {
    const usuarios = await UsuariosApi.listar();
    log('Usuarios cargados:', usuarios);
    renderizarTabla(usuarios);
  } catch (error) {
    log('Error al cargar usuarios:', error);
  }
}
```

#### Debuggear peticiones fetch

```javascript
// En js/api/usuariosApi.js, intercepta las llamadas:
const UsuariosApi = {
  async listar() {
    const url = `${API_BASE_URL}/usuarios`;
    console.log('Petición GET a:', url);
    
    const respuesta = await fetch(url);
    console.log('Status:', respuesta.status);
    console.log('Headers:', respuesta.headers);
    
    const json = await respuesta.json();
    console.log('Response JSON:', json);
    
    if (!respuesta.ok) {
      throw new Error(json.error || 'Error desconocido');
    }
    return json;
  }
};
```

#### DevTools del Navegador

```
Abre: F12 (o Cmd+Option+I en macOS)

Pestañas útiles:
- Console: Ver logs y ejecutar código
- Network: Ver peticiones HTTP
- Application > Local Storage: Ver datos guardados
- Sources: Debugger interactivo
```

---

## Testing Manual

### Scenario 1: Crear un usuario completo

```bash
# 1. Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "primerNombre": "Test",
    "primerApellido": "Usuario",
    "fechaNacimiento": "2000-01-15",
    "ciudadDomicilio": "Bogota"
  }'

# Respuesta esperada (201 Created):
# {"id": 1, "primerNombre": "Test", ...}

# 2. Verificar que se creó
curl http://localhost:3000/api/usuarios/1

# 3. Crear teléfono para el usuario
curl -X POST http://localhost:3000/api/telefonos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 1,
    "numeroTelefono": "3001234567",
    "tipoTelefono": "Celular"
  }'

# 4. Verificar que el usuario tiene el teléfono anidado
curl http://localhost:3000/api/usuarios/1
```

### Scenario 2: Validación de errores

```bash
# Intenta crear usuario sin datos obligatorios
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{}'

# Respuesta esperada (400 Bad Request):
# {"error": "Datos inválidos", "detalles": [...]}

# Intenta crear teléfono con usuario inexistente
curl -X POST http://localhost:3000/api/telefonos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 9999,
    "numeroTelefono": "3001234567",
    "tipoTelefono": "Celular"
  }'

# Respuesta esperada (400 Bad Request):
# {"error": "La referencia indicada no existe (llave foranea invalida)"}
```

### Scenario 3: CORS

```bash
# Verificar que CORS está habilitado
curl -i -X OPTIONS http://localhost:3000/api/usuarios \
  -H "Origin: http://localhost:8000"

# Deberías ver estos headers:
# Access-Control-Allow-Origin: http://localhost:8000
# Vary: Origin
```

---

## Mejores Prácticas

### Code Organization

✅ **Archivo pequeño y enfocado**
```javascript
// usuarioService.js (100 líneas)
// ✓ Una responsabilidad: lógica de Usuario
// ✓ Fácil de testear
// ✓ Fácil de entender
```

❌ **Archivo grande y complejo**
```javascript
// app.js (500 líneas)
// ✗ Mezcla rutas, servicios, modelos
// ✗ Difícil de testear
// ✗ Propenso a errores
```

### Naming Conventions

✅ **Nombres descriptivos y claros**
```javascript
async function obtenerUsuarioPorId(id) { }
const usuarioActualizado = { ...usuario, edad: newAge };
```

❌ **Nombres cortos o ambiguos**
```javascript
async function get(i) { }
const u = { ...usuario, a: newAge };
```

### Comentarios

✅ **Comentarios que explican el "por qué"**
```javascript
// Recalculamos edad porque la fecha de nacimiento pudo cambiar
const edad = calcularEdad(datos.fechaNacimiento);
```

❌ **Comentarios obvios**
```javascript
// Calcula la edad
const edad = calcularEdad(datos.fechaNacimiento);
```

### Manejo de Errores

✅ **Errores específicos**
```javascript
if (edad < 0 || edad > 150) {
  throw crearError('Edad debe estar entre 0 y 150 años', 400);
}
```

❌ **Errores genéricos**
```javascript
if (!datos) {
  throw new Error('Error');
}
```

---

## Performance

### Backend

#### 1. Usar índices en la BD

```sql
-- Agrega índices en campos que se buscan frecuentemente
ALTER TABLE USUARIO ADD INDEX idx_estado (estado);
ALTER TABLE USUARIO ADD INDEX idx_ciudad (ciudad_domicilio);
ALTER TABLE TELEFONO ADD INDEX idx_usuario_id (USUARIO_id);
```

#### 2. Evitar N+1 queries

❌ **Problema: 1 + N queries**
```javascript
// Carga usuario (1 query)
const usuario = await usuarioModel.obtenerPorId(1);

// Luego carga sus teléfonos (N queries, una por cada usuario)
const telefonos = await telefonoModel.obtenerPorUsuario(usuario.id);
```

✅ **Solución: JOIN o batch loading**
```javascript
// Una sola query con JOIN
const usuario = await usuarioService.obtenerDetalle(1);
// Ya trae teléfonos y perfiles anidados
```

#### 3. Connection pooling

Ya está implementado en `src/config/database.js`:
```javascript
const pool = mysql.createPool({
  connectionLimit: 10, // Máximo de conexiones
  waitForConnections: true,
  queueLimit: 0
});
```

### Frontend

#### 1. Lazy loading de datos

```javascript
// ✅ BUENO: solo carga cuando el usuario entra a la pestaña
document.querySelector('[data-tab="telefonos"]').addEventListener('click', () => {
  if (!telefonosLoaded) {
    TelefonosOrganism.cargar();
    telefonosLoaded = true;
  }
});
```

#### 2. Evitar re-renders innecesarios

```javascript
// ✅ BUENO: verifica si los datos cambiaron
function renderizarTabla(usuariosNuevos) {
  if (JSON.stringify(usuarios) === JSON.stringify(usuariosNuevos)) {
    return; // No re-renderizar
  }
  // ... actualizar DOM
}
```

#### 3. Debouncing en búsquedas

```javascript
// Implementar búsqueda con delay
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const buscar = debounce(async (texto) => {
  const usuarios = await UsuariosApi.buscar(texto);
  renderizarTabla(usuarios);
}, 300);

inputBusqueda.addEventListener('input', (e) => {
  buscar(e.target.value);
});
```

---

## Seguridad

### Backend

#### 1. SQL Injection Prevention

✅ **Siempre usar SQL parametrizado**
```javascript
// SEGURO: usando placeholders ?
const [filas] = await pool.query(
  'SELECT * FROM USUARIO WHERE id = ?',
  [id]
);
```

❌ **NUNCA concatenar strings**
```javascript
// INSEGURO: vulnerable a inyección SQL
const [filas] = await pool.query(
  `SELECT * FROM USUARIO WHERE id = ${id}`
);
```

#### 2. Validación de entrada

```javascript
// En utils/validators.js
function validarUsuario(datos) {
  const errores = [];
  
  // Validar tipo
  if (typeof datos.primerNombre !== 'string') {
    errores.push('primerNombre debe ser texto');
  }
  
  // Validar largo
  if (datos.primerNombre.length > 45) {
    errores.push('primerNombre no puede exceder 45 caracteres');
  }
  
  // Validar formato
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaNacimiento)) {
    errores.push('fechaNacimiento debe ser YYYY-MM-DD');
  }
  
  return errores;
}
```

#### 3. Rate Limiting (futuro)

```javascript
// Instalar: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests
});

app.use('/api/', limiter);
```

### Frontend

#### 1. Prevenir XSS

✅ **Escapar HTML de datos no confiables**
```javascript
// En dom.js
function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Uso
fila.innerHTML = `
  <td>${escaparHtml(usuario.nombreCompleto)}</td>
`;
```

❌ **NUNCA usar innerHTML con datos del usuario**
```javascript
// INSEGURO: si usuario.nombre contiene HTML/JS, se ejecuta
elemento.innerHTML = usuario.nombre;
```

#### 2. HTTPS (en producción)

Configurar certificado SSL en el servidor.

---

## Troubleshooting Avanzado

### Problema: "Connection timeout"

```bash
# 1. Verifica que MySQL está corriendo
brew services list | grep mysql

# 2. Verifica que la BD existe
mysql -u personal_manager -p -e "SHOW DATABASES;"

# 3. Aumenta el timeout en database.js
const pool = mysql.createPool({
  connectionTimeout: 10000, // 10 segundos
  // ...
});
```

### Problema: "Port 3000 already in use"

```bash
# Encuentra qué proceso usa el puerto
lsof -i :3000

# Mata el proceso
kill -9 PID

# O cambia el puerto en .env
SERVER_PORT=3001
```

### Problema: CORS error persiste

```bash
# 1. Verifica que backend devuelve headers CORS
curl -i http://localhost:3000/api/usuarios

# 2. Verifica que frontend hace fetch con preflight
curl -i -X OPTIONS http://localhost:3000/api/usuarios

# 3. Revisa que CORS_ORIGIN en .env es exacto
# http://localhost:8000 (no http://127.0.0.1:8000)
```

### Problema: Cambios en BD no aparecen

```bash
# 1. Verifica que table tiene el campo
mysql> DESCRIBE USUARIO;

# 2. Verifica que la query SQL es correcta
mysql> SELECT * FROM USUARIO LIMIT 1;

# 3. Reinicia el backend para que recargue el pool
# Ctrl+C y luego npm start
```

---

## Próximos Pasos para Mejorar

### Corto Plazo
- [ ] Agregar tests unitarios (Jest)
- [ ] Agregar tests E2E (Cypress)
- [ ] Mejorar validación en cliente
- [ ] Agregar paginación

### Mediano Plazo
- [ ] Agregar autenticación (JWT)
- [ ] Agregar autorización (roles)
- [ ] Mejorar UI/UX (animations)
- [ ] Agregar PWA (Progressive Web App)

### Largo Plazo
- [ ] Agregar búsqueda y filtros avanzados
- [ ] Agregar exportar a PDF/Excel
- [ ] Agregar notificaciones en tiempo real (WebSockets)
- [ ] Dockerizar la aplicación

---

## 📚 Recursos Útiles

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MDN Performance](https://developer.mozilla.org/es/docs/Web/Performance)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

**Última actualización**: Septiembre 2026
