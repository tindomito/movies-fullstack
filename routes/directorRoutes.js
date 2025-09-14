const express = require('express');
const directorController = require('../controllers/directorController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/', directorController.getAllDirectors);
router.get('/search', directorController.searchByName);
router.get('/stats', directorController.getDirectorStats);
router.get('/nationality/:nationality', directorController.getDirectorsByNationality);
router.get('/:id', directorController.getDirectorById);

// Rutas protegidas (requieren autenticación)
router.post('/', 
    authenticateToken, 
    requireAdmin, 
    validate('createDirector'), 
    directorController.createDirector
);

router.put('/:id', 
    authenticateToken, 
    requireAdmin, 
    validate('updateDirector'), 
    directorController.updateDirector
);

router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    directorController.deleteDirector
);

module.exports = router;