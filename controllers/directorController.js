const Director = require('../models/Director');
const Movie = require('../models/Movie');

const directorController = {
    // Obtener todos los directores con filtros
    getAllDirectors: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                nationality,
                isActive,
                search,
                sortBy = 'createdAt',
                order = 'desc'
            } = req.query;

            // Construir filtros
            const filters = {};

            if (nationality) {
                filters.nationality = { $regex: nationality, $options: 'i' };
            }

            if (isActive !== undefined) {
                filters.isActive = isActive === 'true';
            }

            if (search) {
                filters.$text = { $search: search };
            }

            // Configurar ordenamiento
            const sortOptions = {};
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;

            // Ejecutar consulta con paginación
            const skip = (page - 1) * limit;
            const directors = await Director.find(filters)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Director.countDocuments(filters);

            res.json({
                success: true,
                data: {
                    directors,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(total / limit),
                        count: directors.length,
                        totalDirectors: total
                    },
                    filters: req.query
                }
            });
        } catch (error) {
            console.error('Error obteniendo directores:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener director por ID
    getDirectorById: async (req, res) => {
        try {
            const director = await Director.findById(req.params.id);

            if (!director) {
                return res.status(404).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            // Obtener las películas del director
            const movies = await Movie.find({ director: req.params.id })
                .select('title year genre rating poster')
                .sort({ year: -1 });

            res.json({
                success: true,
                data: {
                    director,
                    movies,
                    movieCount: movies.length
                }
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de director inválido'
                });
            }

            console.error('Error obteniendo director:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Crear nuevo director
    createDirector: async (req, res) => {
        try {
            const director = new Director(req.validatedData);
            await director.save();

            res.status(201).json({
                success: true,
                message: 'Director creado exitosamente',
                data: director
            });
        } catch (error) {
            console.error('Error creando director:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Actualizar director
    updateDirector: async (req, res) => {
        try {
            const director = await Director.findByIdAndUpdate(
                req.params.id,
                req.validatedData,
                { new: true, runValidators: true }
            );

            if (!director) {
                return res.status(404).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Director actualizado exitosamente',
                data: director
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de director inválido'
                });
            }

            console.error('Error actualizando director:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Eliminar director
    deleteDirector: async (req, res) => {
        try {
            // Verificar si el director tiene películas asociadas
            const movieCount = await Movie.countDocuments({ director: req.params.id });
            
            if (movieCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `No se puede eliminar el director porque tiene ${movieCount} película(s) asociada(s)`
                });
            }

            const director = await Director.findByIdAndDelete(req.params.id);

            if (!director) {
                return res.status(404).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Director eliminado exitosamente',
                data: director
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de director inválido'
                });
            }

            console.error('Error eliminando director:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Buscar directores por nombre
    searchByName: async (req, res) => {
        try {
            const { q: query, limit = 10 } = req.query;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                });
            }

            const directors = await Director.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { fullName: { $regex: query, $options: 'i' } }
                ]
            })
            .limit(parseInt(limit))
            .sort({ name: 1 });

            res.json({
                success: true,
                data: {
                    directors,
                    count: directors.length,
                    query
                }
            });
        } catch (error) {
            console.error('Error buscando directores:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener directores por nacionalidad
    getDirectorsByNationality: async (req, res) => {
        try {
            const { nationality } = req.params;
            const { limit = 10, page = 1 } = req.query;

            const skip = (page - 1) * limit;
            const directors = await Director.find({
                nationality: { $regex: nationality, $options: 'i' }
            })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ name: 1 });

            const total = await Director.countDocuments({
                nationality: { $regex: nationality, $options: 'i' }
            });

            res.json({
                success: true,
                data: {
                    directors,
                    nationality,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(total / limit),
                        count: directors.length,
                        totalDirectors: total
                    }
                }
            });
        } catch (error) {
            console.error('Error obteniendo directores por nacionalidad:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener estadísticas de directores
    getDirectorStats: async (req, res) => {
        try {
            const stats = await Director.aggregate([
                {
                    $group: {
                        _id: '$nationality',
                        count: { $sum: 1 },
                        avgAge: { 
                            $avg: {
                                $divide: [
                                    { $subtract: [new Date(), '$birthDate'] },
                                    1000 * 60 * 60 * 24 * 365
                                ]
                            }
                        }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            const totalDirectors = await Director.countDocuments();
            const activeDirectors = await Director.countDocuments({ isActive: true });

            res.json({
                success: true,
                data: {
                    byNationality: stats,
                    totalDirectors,
                    activeDirectors,
                    inactiveDirectors: totalDirectors - activeDirectors
                }
            });
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

module.exports = directorController;