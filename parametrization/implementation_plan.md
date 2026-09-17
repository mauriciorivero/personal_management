# Plan de Implementación — Sistema de Gestión Personal

## 1. Objetivo

Construir una aplicación web completa (backend + frontend) para administrar usuarios, sus
teléfonos, las redes sociales disponibles y los perfiles sociales de cada usuario. El proyecto
tiene fines didácticos (SENA), por lo que **todo el código debe incluir comentarios en español**
explicando qué hace cada función/bloque relevante.

Fuentes de referencia usadas para este plan:
- `DB_parametrization/DB_relational_model.sql` → modelo relacional (tablas y relaciones).
- `js_clases/*.js` → modelo de negocio orientado a objetos (Usuario, Telefono, RedSocial, PerfilSocial).
- `notas_implementacion.md` → parámetros de conexión, estructura de carpetas y requisitos del frontend.

## 2. Modelo de datos y de negocio

| Tabla MySQL     | Clase de dominio | Relación                                                    |
|-----------------|------------------|---------------------------------------------------------------|
| `USUARIO`       | `Usuario`        | 1 usuario → N teléfonos, N perfiles sociales                  |
| `TELEFONO`      | `Telefono`       | N teléfonos → 1 usuario (FK `USUARIO_id`)                     |
| `RED_SOCIAL`    | `RedSocial`      | catálogo (nombre, url)                                        |
| `PERFIL_SOCIAL` | `PerfilSocial`   | tabla intermedia N:M entre `USUARIO` y `RED_SOCIAL` (PK compuesta `RED_SOCIAL_id` + `USUARIO_id`) |

Notas de diseño relevantes tomadas del esquema SQL:
- `TELEFONO.USUARIO_id` y `PERFIL_SOCIAL` tienen `ON DELETE NO ACTION`: no se puede borrar
  físicamente un `USUARIO` que tenga teléfonos o perfiles asociados. Por eso el borrado de un
  usuario se implementa como **borrado lógico** (columna `estado` → `0`), igual que `TELEFONO`
  ya trae su propia bandera `activo`.
- `edad` es una columna propia de `USUARIO` (no calculada por MySQL). El backend la recalculará
  automáticamente a partir de `fecha_nacimiento` en cada creación/actualización, para evitar
  inconsistencias con lo que envíe el cliente.
- Las clases en `js_clases/` usan campos privados (`#campo`) y métodos `toJSON()`. El backend
  reutiliza ese mismo patrón (copiado a `BACKEND/src/models/entities/`) para que el proyecto
  `BACKEND` sea autocontenido y desplegable de forma independiente.

## 3. Arquitectura Backend (`BACKEND/`)

Node.js + Express + `mysql2/promise` (sin ORM, SQL parametrizado). Estructura definida en
`notas_implementacion.md`, con una subcarpeta adicional `models/entities` para las clases de dominio:

```
BACKEND/
├── src/
│   ├── config/
│   │   ├── environment.js   # Carga variables de entorno (.env)
│   │   └── database.js      # Pool de conexiones MySQL + verificación de conexión
│   ├── models/
│   │   ├── entities/        # Clases de dominio (Usuario, Telefono, RedSocial, PerfilSocial)
│   │   ├── usuarioModel.js       # Acceso a datos (SQL) de USUARIO
│   │   ├── telefonoModel.js      # Acceso a datos de TELEFONO
│   │   ├── redSocialModel.js     # Acceso a datos de RED_SOCIAL
│   │   └── perfilSocialModel.js  # Acceso a datos de PERFIL_SOCIAL
│   ├── services/             # Lógica de negocio, arma entidades de dominio
│   ├── controllers/          # Parsean request / responden JSON
│   ├── routes/                # Definición de endpoints Express
│   ├── middleware/
│   │   ├── errorHandler.js   # Manejo centralizado de errores (incluye errores de MySQL)
│   │   └── validateInput.js  # Middleware genérico de validación de body
│   ├── utils/
│   │   ├── validators.js     # Reglas de validación por entidad
│   │   └── helpers.js        # calcularEdad(), respuestas estándar, etc.
│   └── app.js                 # Configuración de Express (CORS, JSON, rutas, errores)
├── .env / .env.example
├── .gitignore
├── package.json
└── server.js                  # Punto de entrada (arranca el servidor HTTP)
```

Capas y responsabilidad de cada una:
1. **Model** (`models/*Model.js`): ejecuta SQL parametrizado contra el pool de MySQL y devuelve
   filas planas (objects). No conoce reglas de negocio.
2. **Service** (`services/*Service.js`): construye instancias de las clases de dominio a partir
   de las filas, aplica reglas de negocio (cálculo de edad, ensamblar teléfonos/perfiles dentro
   de un `Usuario`, validaciones de existencia) y devuelve entidades de dominio.
3. **Controller**: recibe el request, llama al service y responde con `entidad.toJSON()`
   (o un arreglo mapeado), con el código HTTP correspondiente.
4. **Routes**: mapean verbo+URL → controller, aplicando el middleware de validación.

### Variables de entorno (`.env`)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_management
DB_USER=personal_manager
DB_PASSWORD=person_123456*
SERVER_PORT=3000
CORS_ORIGIN=http://localhost:8000
```

## 4. Arquitectura Frontend (`FRONTEND/`)

HTML/CSS/JS vanilla, una sola pantalla (SPA sin framework ni router), con navegación por
pestañas (tab navigation) en el header para los 4 módulos. Nomenclatura de componentes con
**Atomic Design** y paleta/tipografía inspirada en el **sistema de diseño de Vercel**.

```
FRONTEND/
├── index.html                 # Único documento HTML (header + 4 secciones/tabs)
├── css/
│   ├── tokens.css             # Variables de diseño (colores, tipografía, espaciado) estilo Vercel
│   ├── atoms.css              # Botones, inputs, labels, badges
│   ├── molecules.css          # Grupos de campo, filas de tabla, tarjetas
│   ├── organisms.css          # Formularios completos, tablas, header con tabs
│   └── main.css                # Layout general y reset
├── js/
│   ├── config.js               # URL base de la API
│   ├── api/                    # Funciones fetch async por entidad
│   │   ├── usuariosApi.js
│   │   ├── telefonosApi.js
│   │   ├── redesSocialesApi.js
│   │   └── perfilesSocialesApi.js
│   ├── utils/
│   │   └── dom.js              # Helpers para crear elementos y mostrar notificaciones
│   ├── organisms/               # Un módulo por cada tab (form + tabla + eventos)
│   │   ├── usuariosOrganism.js
│   │   ├── telefonosOrganism.js
│   │   ├── redesSocialesOrganism.js
│   │   └── perfilesSocialesOrganism.js
│   └── main.js                  # Bootstrap: navegación entre tabs e inicialización
```

Cada organism (por módulo) expone: formulario de creación/edición (mismo formulario, cambia de
modo), tabla de listado con acciones "Editar" / "Eliminar", y se comunica con el backend
exclusivamente vía `fetch` + `async/await` definido en `js/api/`.

## 5. Endpoints de la API REST

Prefijo común: `/api`. Formato de respuesta JSON. Códigos usados: `200` (OK), `201` (creado),
`400` (validación), `404` (no encontrado), `409` (conflicto de integridad referencial),
`500` (error interno).

### Usuarios
| Método | URL                          | Descripción                                    |
|--------|------------------------------|-------------------------------------------------|
| GET    | `/api/usuarios`               | Lista todos los usuarios (sin teléfonos/perfiles anidados) |
| GET    | `/api/usuarios/:id`           | Detalle de un usuario, incluye teléfonos y perfiles sociales |
| POST   | `/api/usuarios`               | Crea un usuario (recalcula `edad`)             |
| PUT    | `/api/usuarios/:id`           | Actualiza un usuario                            |
| DELETE | `/api/usuarios/:id`           | Borrado lógico (`estado = 0`)                   |

### Teléfonos
| Método | URL                                | Descripción                        |
|--------|------------------------------------|-------------------------------------|
| GET    | `/api/telefonos`                   | Lista todos los teléfonos          |
| GET    | `/api/telefonos/usuario/:usuarioId`| Teléfonos de un usuario específico |
| POST   | `/api/telefonos`                   | Crea un teléfono                   |
| PUT    | `/api/telefonos/:id`               | Actualiza un teléfono               |
| DELETE | `/api/telefonos/:id`               | Elimina físicamente el teléfono    |

### Redes Sociales
| Método | URL                          | Descripción                  |
|--------|------------------------------|-------------------------------|
| GET    | `/api/redes-sociales`         | Lista el catálogo             |
| POST   | `/api/redes-sociales`         | Crea una red social            |
| PUT    | `/api/redes-sociales/:id`     | Actualiza una red social        |
| DELETE | `/api/redes-sociales/:id`     | Elimina (409 si tiene perfiles asociados) |

### Perfiles Sociales
| Método | URL                                                    | Descripción                     |
|--------|---------------------------------------------------------|----------------------------------|
| GET    | `/api/perfiles-sociales`                                 | Lista todos (join con nombre de usuario y red social) |
| GET    | `/api/perfiles-sociales/usuario/:usuarioId`              | Perfiles de un usuario           |
| POST   | `/api/perfiles-sociales`                                 | Crea `{ redSocialId, usuarioId, urlPerfil }` |
| PUT    | `/api/perfiles-sociales/:redSocialId/:usuarioId`          | Actualiza `urlPerfil`            |
| DELETE | `/api/perfiles-sociales/:redSocialId/:usuarioId`          | Elimina el perfil social          |

## 6. Puesta en marcha

### Base de datos
```bash
# Como root o un usuario con privilegios de creación:
mysql -u root -p < DB_parametrization/DB_relational_model.sql

# Notas: el usuario `personal_manager` (ver notas_implementacion.md) debe existir y tener
# privilegios GRANT ALL sobre el esquema `personal_management` ya creado.
```
> Diagnóstico realizado durante este plan: inicialmente el esquema `personal_management` no
> existía y el usuario `personal_manager` no tenía privilegio `CREATE`. El usuario del proyecto
> creó el esquema y otorgó los privilegios (`GRANT ALL PRIVILEGES ... FLUSH PRIVILEGES`) durante
> esta misma sesión de trabajo.

### Backend
```bash
cd BACKEND
npm install
cp .env.example .env   # ajustar credenciales si es necesario
npm run dev             # nodemon, recarga en caliente
# o
npm start                # producción
# API disponible en http://localhost:3000/api
```

### Frontend
```bash
cd FRONTEND
npx http-server -p 8000
# Abrir http://localhost:8000
```

## 7. Alcance de esta iteración

Se implementa el CRUD completo de las 4 entidades en backend y frontend, validaciones básicas
por entidad, manejo centralizado de errores (incluyendo errores de llave foránea de MySQL) y
CORS habilitado entre `http://localhost:8000` (frontend) y `http://localhost:3000` (backend).
No se incluye autenticación/autorización ni paginación (no solicitadas en los requisitos).

## 8. Verificación realizada

Contra la base de datos real (`personal_management`), con el backend en `http://localhost:3000`
y el frontend servido en `http://localhost:8000`, se probó exitosamente:
- CRUD completo de Usuario, incluyendo recálculo automático de `edad` y borrado lógico (`estado = 0`).
- CRUD completo de Telefono, asociado correctamente a un Usuario.
- CRUD completo de RedSocial.
- Creación y borrado de PerfilSocial, incluyendo el detalle anidado de Usuario con sus
  `telefonos` y `perfilesSociales`.
- Rechazo con `409 Conflict` al intentar borrar una RedSocial con un PerfilSocial asociado.
- Rechazo con `400 Bad Request` ante datos inválidos en el body.
- Encabezados CORS correctos (`Access-Control-Allow-Origin: http://localhost:8000`) en todas
  las respuestas.
- Los 17 archivos estáticos del frontend (HTML, CSS, JS) se sirven correctamente desde `http-server`.
