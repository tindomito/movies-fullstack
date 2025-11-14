const express = require('express');
const movieController = require('../controllers/movieController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchByTitle);
router.get('/genre/:genre', movieController.getMoviesByGenre);
router.get('/:id', movieController.getMovieById);

// Rutas protegidas (requieren autenticación)
router.post('/', 
    authenticateToken, 
    requireAdmin, 
    validate('createMovie'), 
    movieController.createMovie
);

router.put('/:id', 
    authenticateToken, 
    requireAdmin, 
    validate('updateMovie'), 
    movieController.updateMovie
);

router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    movieController.deleteMovie
);

module.exports = router;