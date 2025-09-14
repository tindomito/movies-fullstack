const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');
const directorRoutes = require('./routes/directorRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies_api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Ruta principal - página de información
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/directors', directorRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores generales
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}`);
});
