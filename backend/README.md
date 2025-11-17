Cómo levantar el proyecto
1. Clonar repositorio
bashgit clone https://github.com/tindomito/movies-fullstack.git
cd movies-fullstack
2. Configurar Backend
bashcd backend
npm install
Crear archivo .env con:
MONGODB_URI=mongodb+srv://teoindomito_db_user:admin123@clusterhibridas.yaebfqc.mongodb.net/movies_api?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
PORT=3000
Iniciar backend:
bashnpm run dev
Backend corre en: http://localhost:3000
3. Configurar Frontend
Abrir nueva terminal:
bashcd frontend
npm install
npm run dev
Frontend corre en: http://localhost:5173

Usuario de prueba
Email: admin@movies.com
Password: admin123
Importante: Después de registrarte, cambiar el rol a "admin" en MongoDB Compass:

Conectar Compass a la base de datos
Ir a: movies_api → users
Editar tu usuario: "role": "user" → "role": "admin"


Endpoints principales
Autenticación

POST /api/auth/register - Registrarse
POST /api/auth/login - Login

Películas

GET /api/movies - Todas las películas
GET /api/movies/:id - Una película
POST /api/movies - Crear (admin)
PUT /api/movies/:id - Editar (admin)
DELETE /api/movies/:id - Eliminar (admin)

Directores

GET /api/directors - Todos los directores
GET /api/directors/:id - Un director
POST /api/directors - Crear (admin)
PUT /api/directors/:id - Editar (admin)
DELETE /api/directors/:id - Eliminar (admin)


Estructura básica
movies-fullstack/
├── backend/           # API REST
│   ├── controllers/   # Lógica
│   ├── models/        # Esquemas MongoDB
│   ├── routes/        # Rutas
│   ├── middleware/    # Auth y validaciones
│   └── server.js
└── frontend/          # React app
    ├── src/
    │   ├── pages/     # Páginas
    │   ├── components/# Componentes
    │   ├── context/   # Auth context
    │   └── services/  # API calls
    └── App.jsx

🛠 Tecnologías
Backend: Node.js, Express, MongoDB, JWT, Joi, Bcrypt
Frontend: React, Vite, Axios, React Router

Notas

El archivo .env NO se sube a GitHub
Los tokens expiran en 7 días
Solo usuarios admin pueden crear/editar/eliminar
MongoDB Atlas necesita conexión a internet


Repositorio: https://github.com/tindomito/movies-fullstack