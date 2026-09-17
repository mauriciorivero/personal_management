# 🤝 Guía de Contribución

Gracias por tu interés en contribuir a este proyecto educativo. Esta guía te ayudará a entender cómo trabajar con el código, hacer cambios y contribuir de manera efectiva.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Empezar](#cómo-empezar)
3. [Proceso de Desarrollo](#proceso-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Convenciones de Commits](#convenciones-de-commits)
6. [Pull Requests](#pull-requests)
7. [Reportar Bugs](#reportar-bugs)
8. [Sugerir Mejoras](#sugerir-mejoras)

---

## Código de Conducta

### Nuestro Compromiso

En el interés de promover un ambiente abierto y acogedor, nos comprometemos a:

- ✅ Ser respetuosos con las opiniones de otros
- ✅ Aceptar críticas constructivas
- ✅ Enfocarnos en lo que es mejor para la comunidad
- ✅ Mostrar empatía con otros miembros

### Comportamiento Inaceptable

❌ Acoso de cualquier tipo  
❌ Comentarios despectivos  
❌ Ataque personal o político  
❌ Publicación de información privada sin consentimiento  

---

## Cómo Empezar

### 1️⃣ Fork del Repositorio

```bash
# En GitHub, haz clic en "Fork" en la esquina superior derecha
```

### 2️⃣ Clonar tu fork

```bash
git clone https://github.com/TU_USUARIO/personal_management.git
cd personal_management
```

### 3️⃣ Agregar upstream remoto

```bash
# Para mantener sincronizado con el repositorio original
git remote add upstream https://github.com/USUARIO_ORIGINAL/personal_management.git
```

### 4️⃣ Crear una rama para tu característica

```bash
# Actualiza main
git fetch upstream
git checkout main
git merge upstream/main

# Crea una rama para tu trabajo
git checkout -b feature/nombre-descriptivo
```

---

## Proceso de Desarrollo

### Paso 1: Hacer cambios

Edita los archivos necesarios respetando la estructura del proyecto:

```
personal_management/
├── BACKEND/        → Cambios en la API
├── FRONTEND/       → Cambios en la interfaz
├── js_clases/      → Cambios en el modelo de dominio
└── DB_parametrization/  → Cambios en la BD
```

### Paso 2: Verificar tu código

```bash
# Backend: verificar sintaxis
cd BACKEND
node -c server.js
find src -name "*.js" -exec node -c {} \;

# Frontend: verificar sintaxis
cd ../FRONTEND
find js -name "*.js" -exec node -c {} \;
```

### Paso 3: Probar localmente

```bash
# Terminal 1: Backend
cd BACKEND
npm start

# Terminal 2: Frontend
cd FRONTEND
python3 -m http.server 8000

# Abre http://localhost:8000 y prueba tu cambio
```

### Paso 4: Commit y push

```bash
# Ver cambios
git status
git diff

# Staging de cambios
git add ARCHIVO_MODIFICADO

# Commit con mensaje descriptivo (ver convenciones abajo)
git commit -m "feat: descripción breve del cambio"

# Push a tu fork
git push origin feature/nombre-descriptivo
```

---

## Estándares de Código

### Backend (Node.js/Express)

#### Estilo de Código

```javascript
// ✅ BUENO: Nombres descriptivos, funciones pequeñas
async function crearUsuario(datos) {
  const errores = validarUsuario(datos);
  if (errores.length > 0) {
    throw crearError('Datos inválidos', 400);
  }
  const id = await usuarioModel.crear(datos);
  return obtenerDetalle(id);
}

// ❌ MALO: Nombres cortos, lógica compleja
async function create(d) {
  const u = new Usuario(d);
  return db.insert('USUARIO', u);
}
```

#### Comentarios en Español

```javascript
// Comenta el "por qué", no el "qué"
// ✅ BUENO
// Recalculamos la edad a partir de fechaNacimiento para mantener consistencia
// y no depender de lo que envíe el cliente
const edad = calcularEdad(datos.fechaNacimiento);

// ❌ MALO
// Calcula la edad
const edad = calcularEdad(datos.fechaNacimiento);
```

#### Estructura de carpetas

```
BACKEND/src/
├── config/        # Configuración centralizada
├── models/        # DAO (Data Access Object)
├── services/      # Lógica de negocio
├── controllers/   # Manejadores HTTP
├── routes/        # Definición de endpoints
├── middleware/    # CORS, validación, errores
└── utils/         # Funciones auxiliares
```

### Frontend (JavaScript Vanilla)

#### Naming Conventions

```javascript
// ✅ BUENO: camelCase para variables, kebab-case para clases CSS
const usuarioId = 1;
const selectUsuario = $('#usuario-select');
const formularioUsuario = $('#form-usuario');

// ❌ MALO: nombres inconsistentes
const UsuarioID = 1;
const usuario_select = $('#usuario_select');
```

#### DOM Manipulation

```javascript
// ✅ BUENO: usar funciones helper (dom.js)
const usuario = await UsuariosApi.obtenerPorId(id);
mostrarNotificacion('Usuario creado', 'exito');
const elemento = $('#usuario-nombre');

// ❌ MALO: manipulación directa compleja
document.getElementById('usuario-nombre').innerHTML = usuario.nombre;
```

#### Async/Await

```javascript
// ✅ BUENO
async function cargarUsuarios() {
  try {
    const usuarios = await UsuariosApi.listar();
    renderizarTabla(usuarios);
  } catch (error) {
    mostrarNotificacion(error.message, 'error');
  }
}

// ❌ MALO: callbacks anidados
UsuariosApi.listar(function(usuarios) {
  renderizarTabla(usuarios);
});
```

### CSS

```css
/* ✅ BUENO: siguiendo Atomic Design */
/* tokens.css - variables */
:root {
  --color-primary: #000;
  --space-md: 16px;
}

/* atoms.css - componentes básicos */
.btn {
  padding: var(--space-md);
}

/* molecules.css - combinaciones */
.form-field {
  margin-bottom: var(--space-md);
}

/* organisms.css - componentes complejos */
.entity-form {
  border: 1px solid var(--color-border);
}

/* ❌ MALO: estilos globales, valores hardcodeados */
button {
  padding: 16px;
  color: black;
}
```

---

## Convenciones de Commits

Usamos **Conventional Commits** para mantener el historial limpio y fácil de entender.

### Formato

```
<tipo>: <descripción breve>

<descripción detallada opcional>

<referencias opcionales>
```

### Tipos de Commit

| Tipo | Uso |
|------|-----|
| `feat` | Nueva característica |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (no lógica) |
| `refactor` | Refactorización sin cambio de funcionalidad |
| `test` | Agregar o modificar tests |
| `chore` | Cambios en dependencias, configuración |

### Ejemplos

```bash
# ✅ BUENO
git commit -m "feat: agregar validación de email en formulario de usuario"

# ✅ BUENO: con contexto
git commit -m "fix: corregir cálculo de edad en usuarios con fecha futura

El cálculo de edad redondeaba hacia arriba. Ahora calcula correctamente
restando el año y verificando si cumpleaños ya pasó este año."

# ❌ MALO
git commit -m "actualizar código"

# ❌ MALO: inglés/español mezclado
git commit -m "add new feature in the dashboard"
```

---

## Pull Requests

### 1️⃣ Crear el PR

Cuando hayas completado tu trabajo:

```bash
# Asegúrate de estar en tu rama
git checkout feature/mi-caracteristica

# Actualiza con los cambios más recientes
git fetch upstream
git rebase upstream/main

# Push
git push origin feature/mi-caracteristica
```

Luego, en GitHub, haz clic en **"Compare & pull request"**

### 2️⃣ Descripción del PR

Usa esta plantilla:

```markdown
## Descripción
Breve descripción de qué cambios hace este PR y por qué.

## Tipo de cambio
- [ ] Nueva característica
- [ ] Corrección de bug
- [ ] Cambio de documentación
- [ ] Refactorización

## Cómo probar
Pasos detallados para probar los cambios:
1. Abrir...
2. Hacer clic en...
3. Verificar que...

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He dejado comentarios en el código (cuando es necesario)
- [ ] He actualizado la documentación
- [ ] He probado los cambios localmente
- [ ] No hay warnings o errores en la consola
```

### 3️⃣ Revisión y Merge

- Al menos un revisor debe aprobar
- Todos los comentarios deben ser resueltos
- Los tests deben pasar
- Una vez aprobado, se hará merge a main

---

## Reportar Bugs

### Crear un Issue

1. Ve a **Issues** en GitHub
2. Haz clic en **New Issue**
3. Elige la plantilla **Bug report**

### Información Necesaria

```markdown
## Descripción del bug
Descripción clara de qué no funciona.

## Pasos para reproducir
1. Abre...
2. Completa el formulario con...
3. Haz clic en...
4. El error ocurre...

## Comportamiento esperado
Qué debería pasar.

## Comportamiento actual
Qué está pasando en realidad.

## Environment
- Navegador: Chrome 120
- OS: macOS 14.0
- Node version: 18.0
- MySQL version: 8.0

## Logs y screenshots
```

---

## Sugerir Mejoras

### Crear una Issue de Feature

1. Ve a **Issues** en GitHub
2. Haz clic en **New Issue**
3. Elige la plantilla **Feature request**

### Información Necesaria

```markdown
## Descripción de la mejora
Descripción clara de qué nueva funcionalidad o mejora propones.

## Problema actual
Cuál es el problema o limitación actual.

## Solución propuesta
Cómo debería funcionar.

## Alternativas consideradas
Otras formas de resolver esto.

## Contexto adicional
Información extra relevante.
```

---

## Preguntas Frecuentes

### ¿Cómo actualizo mi fork con los cambios del repositorio original?

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### ¿Cómo deshago cambios en un archivo?

```bash
# Si aún no hiciste commit
git restore ARCHIVO

# Si ya hiciste commit
git revert HASH_DEL_COMMIT
```

### ¿Puedo contribuir si soy principiante?

¡Absolutamente! Este proyecto es educativo. Los cambios pequeños son bienvenidos:
- Mejorar comentarios
- Corregir typos en documentación
- Mejorar mensajes de error
- Agregar ejemplos

---

## 📚 Recursos Útiles

- [Convencional Commits](https://www.conventionalcommits.org/es/)
- [GitHub Pull Requests](https://docs.github.com/en/pull-requests)
- [Git Workflow](https://guides.github.com/introduction/flow/)
- [Markdown Syntax](https://www.markdownguide.org/)

---

## ¡Gracias por contribuir! 🎉

Tu ayuda hace que este proyecto sea mejor para todos los estudiantes.

Si tienes preguntas, no dudes en crear una **Discussion** en GitHub o contactar a los mantenedores.

**Autor del Proyecto**: SENA - Programa de Formación  
**Mantenedor**: [Tu nombre]  
**Última actualización**: Septiembre 2026
