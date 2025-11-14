const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        maxlength: [100, 'El apellido no puede tener más de 100 caracteres']
    },
    fullName: {
        type: String
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    nationality: {
        type: String,
        required: [true, 'La nacionalidad es obligatoria'],
        trim: true
    },
    biography: {
        type: String,
        maxlength: [2000, 'La biografía no puede tener más de 2000 caracteres']
    },
    photo: {
        type: String,
        default: function() {
            return `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`;
        }
    },
    awards: [{
        name: String,
        year: Number,
        category: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual para obtener el nombre completo
directorSchema.virtual('age').get(function() {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
});

// Middleware para crear el nombre completo
directorSchema.pre('save', function(next) {
    this.fullName = `${this.name} ${this.lastName}`;
    next();
});

// Índice para búsqueda de texto
directorSchema.index({ name: 'text', lastName: 'text', fullName: 'text' });
directorSchema.index({ nationality: 1 });

// Virtual para incluir virtuals en JSON
directorSchema.set('toJSON', { virtuals: true });
directorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Director', directorSchema);