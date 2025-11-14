const Joi = require('joi');

// Esquemas de validación
const schemas = {
    // Validación para registro de usuario
    registerUser: Joi.object({
        username: Joi.string().min(3).max(30).required().messages({
            'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
            'string.max': 'El nombre de usuario no puede tener más de 30 caracteres',
            'any.required': 'El nombre de usuario es obligatorio'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Por favor ingrese un email válido',
            'any.required': 'El email es obligatorio'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'any.required': 'La contraseña es obligatoria'
        })
    }),

    // Validación para login
    loginUser: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    // Validación para películas
    createMovie: Joi.object({
        title: Joi.string().max(200).required().messages({
            'string.max': 'El título no puede tener más de 200 caracteres',
            'any.required': 'El título es obligatorio'
        }),
        director: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            'string.pattern.base': 'ID de director inválido',
            'any.required': 'El director es obligatorio'
        }),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5).required(),
        genre: Joi.array().items(Joi.string()).min(1).required().messages({
            'array.min': 'Debe especificar al menos un género',
            'any.required': 'Los géneros son obligatorios'
        }),
        duration: Joi.number().integer().min(1).required(),
        rating: Joi.number().min(0).max(10),
        synopsis: Joi.string().max(1000),
        budget: Joi.number().min(0),
        boxOffice: Joi.number().min(0),
        language: Joi.string(),
        country: Joi.string()
    }),

    updateMovie: Joi.object({
        title: Joi.string().max(200),
        director: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5),
        genre: Joi.array().items(Joi.string()).min(1),
        duration: Joi.number().integer().min(1),
        rating: Joi.number().min(0).max(10),
        synopsis: Joi.string().max(1000),
        budget: Joi.number().min(0),
        boxOffice: Joi.number().min(0),
        language: Joi.string(),
        country: Joi.string()
    }),

    // Validación para directores
    createDirector: Joi.object({
    name: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    birthDate: Joi.date().max('now').required(),
    nationality: Joi.string().required(),
    biography: Joi.string().max(2000).allow('').optional(),  
    isActive: Joi.boolean().optional(),                       
    awards: Joi.array().items(Joi.object({
        name: Joi.string(),
        year: Joi.number().integer(),
        category: Joi.string()
    })).optional()                                            
    }),

    updateDirector: Joi.object({
        name: Joi.string().max(100),
        lastName: Joi.string().max(100),
        birthDate: Joi.date().max('now'),
        nationality: Joi.string(),
        biography: Joi.string().max(2000),
        awards: Joi.array().items(Joi.object({
            name: Joi.string(),
            year: Joi.number().integer(),
            category: Joi.string()
        })),
        isActive: Joi.boolean()
    })
};

// Middleware de validación
const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        
        if (!schema) {
            return res.status(500).json({
                success: false,
                message: 'Error de configuración de validación'
            });
        }

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errorDetails
            });
        }

        req.validatedData = value;
        next();
    };
};

module.exports = { validate };