import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const response = await movieService.getById(id);
      setMovie(response.data.data);
    } catch (err) {
      setError('Error al cargar la película');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta película?')) {
      return;
    }

    try {
      await movieService.delete(id);
      navigate('/movies');
    } catch (err) {
      alert('Error al eliminar la película');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando película...</div>;
  }

  if (error || !movie) {
    return (
      <div style={styles.errorContainer}>
        <p>{error || 'Película no encontrada'}</p>
        <Link to="/movies" style={styles.buttonBack}>Volver a películas</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.posterSection}>
          <img
            src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
            alt={movie.title}
            style={styles.poster}
          />
        </div>

        <div style={styles.infoSection}>
          <div style={styles.header}>
            <h1 style={styles.title}>{movie.title}</h1>
            <div style={styles.rating}>⭐ {movie.rating}/10</div>
          </div>

          <div style={styles.meta}>
            <span style={styles.metaItem}>📅 {movie.year}</span>
            <span style={styles.metaItem}>⏱️ {movie.duration} min</span>
            <span style={styles.metaItem}>🌍 {movie.country || 'N/A'}</span>
            <span style={styles.metaItem}>🗣️ {movie.language || 'N/A'}</span>
          </div>

          <div style={styles.genres}>
            {movie.genre?.map((g, i) => (
              <span key={i} style={styles.genre}>{g}</span>
            ))}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Director</h2>
            {movie.director ? (
              <Link to={`/directors/${movie.director._id}`} style={styles.directorLink}>
                🎭 {movie.director.name} {movie.director.lastName}
                {movie.director.nationality && ` (${movie.director.nationality})`}
              </Link>
            ) : (
              <p>Director no disponible</p>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Sinopsis</h2>
            <p style={styles.synopsis}>{movie.synopsis || 'Sin sinopsis disponible'}</p>
          </div>

          {(movie.budget || movie.boxOffice) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Información Financiera</h2>
              {movie.budget && (
                <p style={styles.financial}>
                  💰 Presupuesto: ${movie.budget.toLocaleString()}
                </p>
              )}
              {movie.boxOffice && (
                <p style={styles.financial}>
                  🎫 Recaudación: ${movie.boxOffice.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div style={styles.actions}>
            <Link to="/movies" style={styles.buttonBackAction}>← Volver</Link>
            {isAdmin() && (
              <>
                <Link to={`/movies/edit/${movie._id}`} style={styles.buttonEdit}>
                  ✏️ Editar
                </Link>
                <button onClick={handleDelete} style={styles.buttonDelete}>
                  🗑️ Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: '2rem 1rem'
  },
  content: {
    margin: '0 auto',
    background: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '2rem'
  },
  posterSection: {
    background: '#000'
  },
  poster: {
    width: '100%',
    height: '600px',
    objectFit: 'cover'
  },
  infoSection: {
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    margin: 0
  },
  rating: {
    background: '#f39c12',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: '#666',
    fontSize: '1rem'
  },
  genres: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  genre: {
    background: '#e8eaf6',
    color: '#667eea',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1rem',
    borderBottom: '2px solid #667eea',
    paddingBottom: '0.5rem'
  },
  directorLink: {
    fontSize: '1.1rem',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500'
  },
  synopsis: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#555'
  },
  financial: {
    fontSize: '1.1rem',
    color: '#27ae60',
    margin: '0.5rem 0',
    fontWeight: '500'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap'
  },
  buttonBackAction: {
    background: '#95a5a6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  buttonEdit: {
    background: '#f39c12',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  buttonDelete: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem'
  },
  buttonBack: {
    display: 'inline-block',
    marginTop: '1rem',
    background: '#667eea',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none'
  },
  '@media (max-width: 768px)': {
    content: {
      gridTemplateColumns: '1fr'
    },
    poster: {
      height: '400px'
    }
  }
};