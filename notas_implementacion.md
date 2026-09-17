1. Crear la base de datos con el script
2. crear el usuario de esa base de datos con todos los privilegios

USE `personal_management` ;

-- 1. Create the user
CREATE USER 'personal_manager'@'localhost' IDENTIFIED BY 'person_123456*';

-- 2. Grant all privileges on a specific schema
GRANT ALL PRIVILEGES ON schema_name.* TO 'personal_manager'@'localhost';

-- 3. Apply changes
FLUSH PRIVILEGES;

3. Crear los parametros de conexion
HOST: localhost
DB: personal_management
USER: personal_management
PASS: person_123456*
PORT: 3306

4. Crear las clases del modelo de negocio en js
5. Inicializar una nueva aplicación node js usando express js y mysql como motor de base de datos
6. Toma el siguiente encarpetado:
BACKEND/
│
├── src/
│   ├── controllers/          # Lógica de control de las rutas
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── ...
│   │
│   ├── routes/              # Definición de rutas
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── index.js         # Agrupa todas las rutas
│   │
│   ├── models/              # Modelos de datos (si usas ORM/ODM)
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── ...
│   │
│   ├── middleware/          # Middlewares personalizados
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validateInput.js
│   │   └── ...
│   │
│   ├── config/              # Configuraciones
│   │   ├── database.js
│   │   ├── environment.js
│   │   └── constants.js
│   │
│   ├── utils/               # Funciones auxiliares
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── ...
│   │
│   ├── services/            # Lógica de negocio
│   │   ├── userService.js
│   │   ├── productService.js
│   │   └── ...
│   │
│   └── app.js               # Configuración principal de Express
│
├── .env                      # Variables de entorno
├── .env.example              # Plantilla de variables
├── .gitignore               # Archivos a ignorar en git
├── package.json             # Dependencias del proyecto
├── server.js (o index.js)   # Punto de entrada
└── README.md                # Documentación


Y crea ese encarpetado en la carpeta backend

el backend debe proporcionar el protocolo CORS para ser accedido desde el frontend en local

7. lista todos los endpoints disponibles junto con su metodo de acceso, su URL y sus codigos de respuesta

8. Crea un frontend en vanilla (HTML, CSS, JS) con el sistema de diseño de Vercel y usando la metodologia de nombrado de componentes de Atomic Design, que corresponda con la funcionalidad expresada en el backend. El frontend debe preentarse o renderizarse en una sola pantalla, con un header donde esten los distintos modulos (usuarios, telefonos, redes sociales y perfiles sociales) a modo de tab navigation y cada pantalla debe tener su formulario para crear cada una de las entidades, editarlas y listarlas. El frontend debe acceder al backend por medio de funciones asincronicas y metodo fetch.

9. El frontend debe cumplir con el protocolo CORS para acceder al backend

10. Se deben listar todos los comandos para iniciarlizar el backend y el frontend.
