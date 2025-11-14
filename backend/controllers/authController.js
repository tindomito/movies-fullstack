const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const authController = {
    // Registro de usuario
    register: async (req, res) => {
        try {
            const { username, email, password } = req.validatedData;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario o email ya están registrados'
                });
            }

            // Crear nuevo usuario
            const user = new User({ username, email, password });
            await user.save();

            // Generar token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.validatedData;

            // Buscar usuario por email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener perfil del usuario actual
    getProfile: async (req, res) => {
        try {
            res.json({
                success: true,
                data: req.user
            });
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Refrescar token
    refreshToken: async (req, res) => {
        try {
            const newToken = generateToken(req.user._id);

            res.json({
                success: true,
                message: 'Token renovado',
                data: {
                    token: newToken
                }
            });
        } catch (error) {
            console.error('Error renovando token:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

module.exports = authController;