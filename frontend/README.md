# Movies Fullstack

API REST de películas y directores con autenticación JWT y roles, más un cliente en React.
Trabajo final de Aplicaciones Híbridas.

**Stack** — Backend: Node.js, Express, MongoDB (Mongoose), JWT, Joi, bcrypt. Frontend: React, Vite, React Router, Axios.

---

## Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tindomito/movies-fullstack.git
```

```bash
cd movies-fullstack
```

### 2. Base de datos

El proyecto necesita una instancia propia de MongoDB. Podés usar un cluster gratuito en
[MongoDB Atlas](https://cloud.mongodb.com) (acordate de habilitar tu IP en Network Access)
o una instalación local de MongoDB Community.

### 3. Backend

```bash
cd backend
```

```bash
npm install
```

Copiá `.env.example` a `.env` y completá los valores con tu propia conexión:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/movies_api?retryWrites=true&w=majority
JWT_SECRET=una_clave_larga_y_aleatoria
JWT_EXPIRES_IN=7d
PORT=3000
```

```bash
npm run dev
```

Backend en `http://localhost:3000`.

### 4. Frontend

En otra terminal:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

Frontend en `http://localhost:5173`.

---

## Crear un usuario administrador

Las rutas de lectura son públicas, pero crear, editar y eliminar requiere rol `admin`.
El registro siempre asigna rol `user`, así que el primer admin se promueve a mano:

1. Registrate desde `/register`.
2. Desde MongoDB Compass o Atlas, abrí `movies_api` → `users`.
3. Editá tu usuario: cambiá `"role": "user"` por `"role": "admin"`.
4. Cerrá sesión y volvé a iniciarla para que el cliente tome el rol nuevo.

Para cargar datos, creá primero un director: las películas requieren uno asociado.

---

## Endpoints principales

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrarse |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Perfil del usuario actual (requiere token) |
| POST | `/api/auth/refresh` | Renovar token (requiere token) |

### Películas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/movies` | Listado con filtros y paginación |
| GET | `/api/movies/search?q=` | Búsqueda por título |
| GET | `/api/movies/genre/:genre` | Filtrar por género |
| GET | `/api/movies/:id` | Detalle |
| POST | `/api/movies` | Crear (admin) |
| PUT | `/api/movies/:id` | Editar (admin) |
| DELETE | `/api/movies/:id` | Eliminar (admin) |

### Directores

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/directors` | Listado con filtros y paginación |
| GET | `/api/directors/search?q=` | Búsqueda por nombre |
| GET | `/api/directors/stats` | Estadísticas por nacionalidad |
| GET | `/api/directors/nationality/:nationality` | Filtrar por nacionalidad |
| GET | `/api/directors/:id` | Detalle, con sus películas |
| POST | `/api/directors` | Crear (admin) |
| PUT | `/api/directors/:id` | Editar (admin) |
| DELETE | `/api/directors/:id` | Eliminar (admin) |

---

## Estructura

```
movies-fullstack/
├── netlify.toml              # Configuración de deploy
├── backend/                  # API REST
│   ├── controllers/          # Lógica de negocio
│   ├── models/               # Esquemas de Mongoose
│   ├── routes/               # Definición de rutas
│   ├── middleware/           # Auth JWT y validaciones Joi
│   ├── netlify/functions/    # Wrapper serverless de la API
│   └── server.js
└── frontend/                 # Cliente React
    └── src/
        ├── pages/            # Vistas
        ├── components/       # Navbar, ProtectedRoute
        ├── context/          # AuthContext
        └── services/         # Cliente Axios
```

---

## Deploy

El repositorio incluye configuración para Netlify (`netlify.toml`): el frontend se publica
desde `frontend/dist` y la API corre como función serverless, con las llamadas a `/api/*`
redirigidas hacia ella.

Las variables de entorno (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`) se cargan desde el
panel de Netlify, no desde el repositorio.

---

## Notas

- El archivo `.env` no se versiona. Usá `.env.example` como plantilla.
- Las contraseñas se hashean con bcrypt y nunca se devuelven en las respuestas.
- Los tokens expiran a los 7 días por defecto.
- No se puede eliminar un director que tenga películas asociadas.

Repositorio: https://github.com/tindomito/movies-fullstack
