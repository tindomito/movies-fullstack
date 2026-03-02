const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Carga variables de entorno desde backend/.env (solo para desarrollo local)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const movieRoutes = require('../../routes/movieRoutes');
const directorRoutes = require('../../routes/directorRoutes');
const authRoutes = require('../../routes/authRoutes');

const app = express();

// Reutilizar la conexión entre invocaciones de la función
let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB antes de cada request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/directors', directorRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
});

module.exports.handler = serverless(app);
