# ⚡ Guía Rápida de Inicio

Inicia el proyecto en **5 minutos** 🚀

---

## Paso 1️⃣: Verificar Requisitos

```bash
# Verifica que tienes Node.js, npm y MySQL
node -v
npm -v
mysql --version
```

Deberías ver versiones similares a:
- Node: v18.0.0+
- npm: 9.0.0+
- MySQL: 8.0+

---

## Paso 2️⃣: Instalar Dependencias

```bash
cd BACKEND
npm install
```

⏱️ **Espera**: 1-2 minutos

---

## Paso 3️⃣: Verificar Base de Datos

```bash
# Conectarse a MySQL
mysql -u personal_manager -p personal_management

# Dentro de MySQL, verificar tablas
SHOW TABLES;

# Deberías ver:
# PERFIL_SOCIAL
# RED_SOCIAL
# TELEFONO
# USUARIO

# Salir
EXIT;
```

Si falta alguna tabla, ejecuta:
```bash
mysql -u root -p < DB_parametrization/DB_relational_model.sql
```

---

## Paso 4️⃣: Iniciar Backend

**Terminal 1:**
```bash
cd BACKEND
npm start
```

Deberías ver:
```
Servidor escuchando en http://localhost:3000
Conexion a MySQL exitosa
```

---

## Paso 5️⃣: Iniciar Frontend

**Terminal 2 (nueva ventana):**
```bash
cd FRONTEND
python3 -m http.server 8000
```

Deberías ver:
```
Serving HTTP on port 8000
```

---

## 🎉 ¡Listo!

Abre tu navegador en:

## **http://localhost:8000**

---

## ¿Qué Puedes Hacer?

### 👤 Pestaña: Usuarios
1. **Crear usuario**: Completa el formulario y haz clic en "Crear Usuario"
2. **Editar**: Haz clic en "Editar" en la tabla
3. **Eliminar**: Haz clic en "Eliminar" para desactivar

### ☎️ Pestaña: Teléfonos
1. Selecciona un usuario
2. Ingresa número y tipo
3. "Crear Teléfono"

### 🌐 Pestaña: Redes Sociales
1. Ingresa nombre (ej: Facebook)
2. Ingresa URL (ej: https://facebook.com)
3. "Crear Red Social"

### 📱 Pestaña: Perfiles Sociales
1. Selecciona usuario y red social
2. Opcionalmente ingresa tu URL de perfil
3. "Crear Perfil Social"

---

## 📊 Verificar que Funciona

En tu navegador, abre **Herramientas de Desarrollador** (F12):

### Pestaña Network
Deberías ver peticiones a:
- `http://localhost:3000/api/usuarios`
- `http://localhost:3000/api/telefonos`
- etc.

### Pestaña Console
Deberías **NO ver errores rojos** (warnings amarillos son OK)

---

## ❌ Si algo no funciona

### Error: "Connection refused" en backend
```bash
# Verifica que MySQL está corriendo
mysql -u personal_manager -p -e "SHOW DATABASES;"
```

### Error: "CORS" en navegador
- Asegúrate que backend está en puerto 3000
- Reinicia ambos servidores

### Error: "Port 3000 already in use"
```bash
# Mata el proceso que usa puerto 3000
lsof -i :3000
kill -9 PID
```

### Error: Tabla está vacía después de crear
- Abre Console (F12)
- Busca mensajes de error rojos
- Verifica que la BD tiene datos: `SELECT COUNT(*) FROM USUARIO;`

---

## 📚 Documentación Completa

Si necesitas más detalles:

| Documento | Propósito |
|-----------|----------|
| **README.md** | Guía completa con diagramas y setup |
| **CLAUDE.md** | Explicación de la arquitectura |
| **PROJECT_STATUS.md** | Estado actual del proyecto |
| **DEVELOPMENT.md** | Debugging y mejores prácticas |

---

## 🎯 Próximos Pasos

1. **Explorar el código**: Abre `BACKEND/src/` y `FRONTEND/js/`
2. **Leer CLAUDE.md**: Entiende cómo está organizado
3. **Hacer cambios pequeños**: Modifica un texto, agrega un botón
4. **Entender el flujo**: Sigue cómo un click en el navegador llega a la BD

---

## ⏸️ Detener la Aplicación

```bash
# En ambas terminales, presiona:
Ctrl + C

# Luego cierra las terminales
```

---

## ✅ Checklist de Verificación

- [ ] Node.js y npm instalados
- [ ] MySQL corriendo con base de datos creada
- [ ] Backend inicia sin errores
- [ ] Frontend carga en http://localhost:8000
- [ ] Puedo crear un usuario en el navegador
- [ ] La consola del navegador (F12) no tiene errores rojos

---

Si tienes problemas, consulta **DEVELOPMENT.md** en la sección "Troubleshooting Avanzado".

¡Bienvenido al Sistema de Gestión Personal! 🚀
