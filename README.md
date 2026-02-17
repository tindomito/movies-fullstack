# Movies Fullstack - Guía de Setup

Aplicación fullstack para gestionar películas y directores con autenticación JWT.

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Vite + Tailwind CSS

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MongoDB Atlas](https://www.mongodb.com/atlas) (cuenta gratuita) o MongoDB local
- npm (viene incluido con Node.js)

---

## Instalación paso a paso

### 1. Descargar el proyecto

Descargá el ZIP desde GitHub (botón verde **Code > Download ZIP**), descomprimilo y abrí la carpeta `movies-fullstack` en tu terminal.

### 2. Configurar el backend

```bash
cd backend
npm install
```

Creá un archivo `.env` copiando el ejemplo:

```bash
cp .env.example .env
```

Editá `.env` con tus datos de MongoDB:

```
MONGODB_URI=tu_connection_string_de_mongodb
JWT_SECRET=una_clave_secreta_cualquiera
JWT_EXPIRES_IN=7d
PORT=3000
```

> Si no tenés MongoDB, creá un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas) y usá el connection string que te da.

### 3. Configurar el frontend

Abrí **otra terminal** en la carpeta raíz del proyecto:

```bash
cd frontend
npm install
```

### 4. Levantar la aplicación

Necesitás **dos terminales** corriendo al mismo tiempo:

**Terminal 1 - Backend (puerto 3000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (puerto 5173):**
```bash
cd frontend
npm run dev
```

### 5. Abrir en el navegador

Entrá a [http://localhost:5173](http://localhost:5173) y listo.

---

## Uso rápido

1. Registrate creando una cuenta desde la app
2. Iniciá sesión con tus credenciales
3. Explorá, creá y editá películas y directores (requiere rol admin)
