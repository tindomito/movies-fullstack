const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas
router.post('/register', validate('registerUser'), authController.register);
router.post('/login', validate('loginUser'), authController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router;