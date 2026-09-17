# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Personal Management System**: A full-stack application for managing user profiles, contact information, and social media profiles. Built with Node.js/Express backend, MySQL database, and vanilla JavaScript frontend.

### Key Domain Entities
- **Usuario**: User profile with name, birthdate, age, location, and status
- **Telefono**: Phone numbers linked to users (multiple per user)
- **RedSocial**: Social network definitions (static reference data)
- **PerfilSocial**: User's social media profiles (junction table linking usuarios to social networks)

The domain model is implemented using JavaScript ES6 classes with private fields in `js_clases/` directory. These classes should be used as the foundation for backend services and API contracts.

## Architecture

### Structure
```
personal_management/
├── js_clases/              # Domain model classes (read-only)
│   ├── Usuario.js
│   ├── Telefono.js
│   ├── RedSocial.js
│   ├── PerfilSocial.js
│   └── index.js           # Re-exports all classes
├── DB_parametrization/    # Database schema
│   └── DB_relational_model.sql
├── BACKEND/               # Express.js server (to be built)
├── FRONTEND/              # Vanilla JS UI (to be built)
└── notas_implementacion.md
```

### Backend Structure (Expected)
Must follow this structure inside `BACKEND/`:
```
src/
├── controllers/          # Route handlers
│   ├── userController.js
│   ├── phoneController.js
│   ├── socialNetworkController.js
│   └── socialProfileController.js
├── routes/              # Express route definitions
│   ├── userRoutes.js
│   ├── phoneRoutes.js
│   ├── socialNetworkRoutes.js
│   ├── socialProfileRoutes.js
│   └── index.js         # Aggregates all routes
├── models/              # Database models/DAO layer
├── middleware/          # Custom middleware
│   ├── errorHandler.js
│   └── cors.js          # CORS configuration
├── services/            # Business logic
├── config/              # Configuration
│   ├── database.js      # MySQL connection
│   └── environment.js
├── utils/               # Utilities & validators
└── app.js               # Express app setup
├── server.js            # Entry point
├── package.json
└── .env                 # Database credentials
```

### Database Configuration
```
HOST: localhost
DB: personal_management
USER: personal_manager
PASSWORD: person_123456*
PORT: 3306
```

## Common Development Tasks

### Database Setup
```bash
# 1. Create database and user
mysql -u root -p < DB_parametrization/DB_relational_model.sql

# 2. Create user with privileges (in MySQL):
CREATE USER 'personal_manager'@'localhost' IDENTIFIED BY 'person_123456*';
GRANT ALL PRIVILEGES ON personal_management.* TO 'personal_manager'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Initialization & Running
```bash
cd BACKEND

# Install dependencies
npm install

# Install required packages (if not in package.json)
npm install express mysql2 cors dotenv

# Create .env file with database credentials
# See BACKEND/src/config/environment.js for required variables

# Run development server
npm start

# The backend API will typically run on http://localhost:3000
```

### Frontend Running
```bash
cd FRONTEND

# No build step needed for vanilla JS
# Serve using a simple HTTP server (Python, Node, etc.)
python3 -m http.server 8000
# or
npx http-server -p 8000

# Access at http://localhost:8000
```

### Database Query & Testing
```bash
# Connect to database
mysql -u personal_manager -p personal_management

# Test connection
SELECT * FROM USUARIO LIMIT 1;
SELECT * FROM TELEFONO LIMIT 1;
```

## Frontend Requirements

### Technology Stack
- **HTML5/CSS3**: Vanilla (no frameworks)
- **JavaScript**: Vanilla ES6+ (async/fetch, no jQuery)
- **Design System**: Vercel design system
- **Component Methodology**: Atomic Design (atoms, molecules, organisms)

### Key Features
1. **Single Page Layout**: All modules accessible via tab navigation
2. **Tab Navigation**: Header with tabs for:
   - Usuarios
   - Telefonos
   - Redes Sociales
   - Perfiles Sociales
3. **Per-Module Features**: Each tab must provide:
   - Form to create new entity
   - Form to edit existing entity
   - List/table of existing entities
4. **CORS Compliance**: Must communicate with backend via fetch API
5. **Async Operations**: All API calls use async/await with fetch

### Component Naming (Atomic Design)
- **Atoms**: Basic inputs, buttons, labels, text fields
- **Molecules**: Input groups, form sections, search bars
- **Organisms**: Forms, tables, navigation headers

## Key Decisions & Constraints

### Domain Model Pattern
The `js_clases/` classes use **private fields** (`#fieldName`) for encapsulation. This is intentional for data integrity. When implementing the backend:
1. Create the domain objects in services/business logic
2. Use `.toJSON()` methods for API responses (see Usuario.js example)
3. The `Usuario` class has helper methods like `getNombreCompleto()` and `obtenerTelefonosActivos()` — use these in service logic

### CORS Setup
The backend must enable CORS middleware to allow frontend requests from `localhost`. Example:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));
```

### API Response Format
All API responses should use the domain model's `.toJSON()` method for consistency. Example for Usuario:
```json
{
  "id": 1,
  "primerNombre": "John",
  "segundoNombre": null,
  "primerApellido": "Doe",
  "segundoApellido": null,
  "fechaNacimiento": "1990-01-15",
  "edad": 34,
  "ciudadDomicilio": "Bogotá",
  "estado": 1,
  "telefonos": [...],
  "perfilesSociales": [...]
}
```

## Frontend Development Notes

### Fetch Pattern
Use async/await for all API calls. Example:
```javascript
async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
```

### DOM Structure Pattern
- Use semantic HTML5 elements
- Classes follow kebab-case naming (e.g., `user-form`, `phone-list-item`)
- IDs are reserved for unique interactive elements

### Styling
- Use Vercel's design system tokens (colors, spacing, typography)
- Maintain consistent spacing and layout using CSS Grid/Flexbox
- Support both light and dark modes where applicable

## Backend Development Notes

### Service Layer Pattern
Business logic belongs in `services/`, not controllers. Controllers should only:
1. Parse request data
2. Call service methods
3. Format responses

Example:
```javascript
// In controllers/userController.js
const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const usuario = await userService.createUsuario(req.body);
    res.json(usuario.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Database Access Pattern
Use the `models/` layer for all database queries. Return domain objects from services.

### Error Handling
Implement consistent error responses:
```javascript
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-09-17T..."
}
```

## API Endpoints Reference

The following endpoints must be implemented:

### Users (USUARIO)
- `GET /api/users` — List all users
- `POST /api/users` — Create user
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Phones (TELEFONO)
- `GET /api/phones` — List all phones
- `GET /api/phones/user/:userId` — Get phones for user
- `POST /api/phones` — Create phone
- `PUT /api/phones/:id` — Update phone
- `DELETE /api/phones/:id` — Delete phone

### Social Networks (RED_SOCIAL)
- `GET /api/social-networks` — List all networks
- `POST /api/social-networks` — Create network
- `PUT /api/social-networks/:id` — Update network
- `DELETE /api/social-networks/:id` — Delete network

### Social Profiles (PERFIL_SOCIAL)
- `GET /api/social-profiles` — List all profiles
- `GET /api/social-profiles/user/:userId` — Get profiles for user
- `POST /api/social-profiles` — Create profile
- `PUT /api/social-profiles/:id` — Update profile
- `DELETE /api/social-profiles/:id` — Delete profile

## Memory Reference

See [Personal Management System Overview](project_overview.md) in session memory for additional context.
