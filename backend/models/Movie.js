const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede tener más de 200 caracteres']
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
        required: [true, 'El director es obligatorio']
    },
    year: {
        type: Number,
        required: [true, 'El año es obligatorio'],
        min: [1900, 'El año debe ser posterior a 1900'],
        max: [new Date().getFullYear() + 5, 'El año no puede ser muy lejano en el futuro']
    },
    genre: {
        type: [String],
        required: [true, 'Al menos un género es obligatorio'],
        validate: {
            validator: function(genres) {
                return genres && genres.length > 0;
            },
            message: 'Debe especificar al menos un género'
        }
    },
    duration: {
        type: Number,
        required: [true, 'La duración es obligatoria'],
        min: [1, 'La duración debe ser mayor a 0 minutos']
    },
    rating: {
        type: Number,
        min: [0, 'La calificación no puede ser menor a 0'],
        max: [10, 'La calificación no puede ser mayor a 10']
    },
    synopsis: {
        type: String,
        maxlength: [1000, 'La sinopsis no puede tener más de 1000 caracteres']
    },
    poster: {
        type: String,
        default: function() {
            return `https://picsum.photos/300/400?random=${Math.floor(Math.random() * 1000)}`;
        }
    },
    budget: {
        type: Number,
        min: [0, 'El presupuesto no puede ser negativo']
    },
    boxOffice: {
        type: Number,
        min: [0, 'La recaudación no puede ser negativa']
    },
    language: {
        type: String,
        default: 'Español'
    },
    country: {
        type: String,
        default: 'Argentina'
    }
}, {
    timestamps: true
});

// Índices para búsqueda eficiente
// movieSchema.index({ title: 'text', synopsis: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: 1 });
movieSchema.index({ rating: -1 });

module.exports = mongoose.model('Movie', movieSchema);