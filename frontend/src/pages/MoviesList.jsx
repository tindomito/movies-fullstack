import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const { isAdmin } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAll();
      setMovies(response.data.data.movies);
    } catch (err) {
      setError('Error al cargar las películas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadMovies();
      return;
    }

    try {
      setLoading(true);
      const response = await movieService.search(searchTerm);
      setMovies(response.data.data.movies);
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta película?')) {
      return;
    }

    try {
      await movieService.delete(id);
      setMovies(movies.filter(movie => movie._id !== id));
    } catch (err) {
      alert('Error al eliminar la película');
    }
  };

  const filteredMovies = genreFilter
    ? movies.filter(movie => movie.genre.includes(genreFilter))
    : movies;

  if (loading) {
    return <div style={styles.loading}>Cargando películas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎥 Películas</h1>
        {isAdmin() && (
          <Link to="/movies/create" style={styles.buttonCreate}>
            + Nueva Película
          </Link>
        )}
      </div>

      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍 Buscar
          </button>
        </form>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Todos los géneros</option>
          <option value="Acción">Acción</option>
          <option value="Drama">Drama</option>
          <option value="Comedia">Comedia</option>
          <option value="Ciencia Ficción">Ciencia Ficción</option>
          <option value="Thriller">Thriller</option>
          <option value="Terror">Terror</option>
          <option value="Aventura">Aventura</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {filteredMovies.map((movie) => (
          <div key={movie._id} style={styles.card}>
            <img
              src={movie.poster || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={movie.title}
              style={styles.poster}
            />
            <div style={styles.cardContent}>
              <h3 style={styles.movieTitle}>{movie.title}</h3>
              <p style={styles.year}>📅 {movie.year}</p>
              <p style={styles.rating}>⭐ {movie.rating}/10</p>
              <div style={styles.genres}>
                {movie.genre.slice(0, 2).map((g, i) => (
                  <span key={i} style={styles.genre}>{g}</span>
                ))}
              </div>
              <p style={styles.synopsis}>
                {movie.synopsis?.substring(0, 100)}...
              </p>

              <div style={styles.actions}>
                <Link to={`/movies/${movie._id}`} style={styles.buttonView}>
                  Ver Detalles
                </Link>
                {isAdmin() && (
                  <>
                    <Link to={`/movies/edit/${movie._id}`} style={styles.buttonEdit}>
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      style={styles.buttonDelete}
                    >
                      🗑️ Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div style={styles.empty}>
          <p>No se encontraron películas</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: '2rem 1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto 2rem',
    padding: '0 1rem'
  },
  title: {
    fontSize: '2rem',
    color: '#333'
  },
  buttonCreate: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    margin: '0 auto 2rem',
    padding: '0 1rem',
    flexWrap: 'wrap'
  },
  searchForm: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  searchButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    minWidth: '200px'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    margin: '0 auto 1rem',
    maxWidth: '1200px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    padding: '0 1rem'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s'
  },
  poster: {
    width: '100%',
    height: '300px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  movieTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  year: {
    color: '#666',
    fontSize: '0.9rem'
  },
  rating: {
    color: '#f39c12',
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: '0.5rem 0'
  },
  genres: {
    display: 'flex',
    gap: '0.5rem',
    margin: '0.5rem 0',
    flexWrap: 'wrap'
  },
  genre: {
    background: '#e8eaf6',
    color: '#667eea',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.8rem'
  },
  synopsis: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: '1rem 0'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  buttonView: {
    background: '#667eea',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'center'
  },
  buttonEdit: {
    background: '#f39c12',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  buttonDelete: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666'
  }
};