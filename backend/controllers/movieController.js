const Movie = require('../models/Movie');
const Director = require('../models/Director');

const movieController = {
    // Obtener todas las películas con filtros
    getAllMovies: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                genre,
                year,
                minRating,
                maxRating,
                director,
                search,
                sortBy = 'createdAt',
                order = 'desc'
            } = req.query;

            // Construir filtros
            const filters = {};

            if (genre) {
                filters.genre = { $in: genre.split(',') };
            }

            if (year) {
                filters.year = year;
            }

            if (minRating || maxRating) {
                filters.rating = {};
                if (minRating) filters.rating.$gte = parseFloat(minRating);
                if (maxRating) filters.rating.$lte = parseFloat(maxRating);
            }

            if (director) {
                filters.director = director;
            }

            if (search) {
                filters.$text = { $search: search };
            }

            // Configurar ordenamiento
            const sortOptions = {};
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;

            // Ejecutar consulta con paginación
            const skip = (page - 1) * limit;
            const movies = await Movie.find(filters)
                .populate('director', 'name lastName nationality')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Movie.countDocuments(filters);

            res.json({
                success: true,
                data: {
                    movies,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(total / limit),
                        count: movies.length,
                        totalMovies: total
                    },
                    filters: req.query
                }
            });
        } catch (error) {
            console.error('Error obteniendo películas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener película por ID
    getMovieById: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id)
                .populate('director', 'name lastName nationality biography photo');

            if (!movie) {
                return res.status(404).json({
                    success: false,
                    message: 'Película no encontrada'
                });
            }

            res.json({
                success: true,
                data: movie
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de película inválido'
                });
            }

            console.error('Error obteniendo película:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Crear nueva película
    createMovie: async (req, res) => {
        try {
            // Verificar que el director existe
            const director = await Director.findById(req.validatedData.director);
            if (!director) {
                return res.status(400).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            const movie = new Movie(req.validatedData);
            await movie.save();
            
            // Poblar los datos del director
            await movie.populate('director', 'name lastName nationality');

            res.status(201).json({
                success: true,
                message: 'Película creada exitosamente',
                data: movie
            });
        } catch (error) {
            console.error('Error creando película:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Actualizar película
    updateMovie: async (req, res) => {
        try {
            // Si se actualiza el director, verificar que existe
            if (req.validatedData.director) {
                const director = await Director.findById(req.validatedData.director);
                if (!director) {
                    return res.status(400).json({
                        success: false,
                        message: 'Director no encontrado'
                    });
                }
            }

            const movie = await Movie.findByIdAndUpdate(
                req.params.id,
                req.validatedData,
                { new: true, runValidators: true }
            ).populate('director', 'name lastName nationality');

            if (!movie) {
                return res.status(404).json({
                    success: false,
                    message: 'Película no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Película actualizada exitosamente',
                data: movie
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de película inválido'
                });
            }

            console.error('Error actualizando película:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Eliminar película
    deleteMovie: async (req, res) => {
        try {
            const movie = await Movie.findByIdAndDelete(req.params.id);

            if (!movie) {
                return res.status(404).json({
                    success: false,
                    message: 'Película no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Película eliminada exitosamente',
                data: movie
            });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de película inválido'
                });
            }

            console.error('Error eliminando película:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Buscar películas por nombre
    searchByTitle: async (req, res) => {
        try {
            const { q: query, limit = 10 } = req.query;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                });
            }

            const movies = await Movie.find({
                title: { $regex: query, $options: 'i' }
            })
            .populate('director', 'name lastName')
            .limit(parseInt(limit))
            .sort({ title: 1 });

            res.json({
                success: true,
                data: {
                    movies,
                    count: movies.length,
                    query
                }
            });
        } catch (error) {
            console.error('Error buscando películas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener películas por género
    getMoviesByGenre: async (req, res) => {
        try {
            const { genre } = req.params;
            const { limit = 10, page = 1 } = req.query;

            const skip = (page - 1) * limit;
            const movies = await Movie.find({
                genre: { $in: [genre] }
            })
            .populate('director', 'name lastName')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ rating: -1 });

            const total = await Movie.countDocuments({
                genre: { $in: [genre] }
            });

            res.json({
                success: true,
                data: {
                    movies,
                    genre,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(total / limit),
                        count: movies.length,
                        totalMovies: total
                    }
                }
            });
        } catch (error) {
            console.error('Error obteniendo películas por género:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

module.exports = movieController;