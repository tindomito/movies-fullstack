import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { directorService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DirectorsList = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { isAdmin } = useAuth();

  useEffect(() => {
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const response = await directorService.getAll();
      setDirectors(response.data.data.directors);
    } catch (err) {
      setError('Error al cargar los directores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadDirectors();
      return;
    }

    try {
      setLoading(true);
      const response = await directorService.search(searchTerm);
      setDirectors(response.data.data.directors);
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este director?')) {
      return;
    }

    try {
      await directorService.delete(id);
      setDirectors(directors.filter(director => director._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el director');
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return <div style={styles.loading}>Cargando directores...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎭 Directores</h1>
        {isAdmin() && (
          <Link to="/directors/create" style={styles.buttonCreate}>
            + Nuevo Director
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          🔍 Buscar
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {directors.map((director) => (
          <div key={director._id} style={styles.card}>
            <img
              src={director.photo || 'https://via.placeholder.com/200x200?text=Director'}
              alt={director.fullName}
              style={styles.photo}
            />
            <div style={styles.cardContent}>
              <h3 style={styles.directorName}>
                {director.name} {director.lastName}
              </h3>
              <p style={styles.nationality}>🌍 {director.nationality}</p>
              {director.birthDate && (
                <p style={styles.age}>
                  🎂 {calculateAge(director.birthDate)} años
                </p>
              )}
              <p style={styles.bio}>
                {director.biography?.substring(0, 120)}
                {director.biography?.length > 120 ? '...' : ''}
              </p>

              {director.awards && director.awards.length > 0 && (
                <div style={styles.awards}>
                  <p style={styles.awardsTitle}>🏆 Premios:</p>
                  {director.awards.slice(0, 2).map((award, i) => (
                    <p key={i} style={styles.award}>
                      • {award.name} ({award.year})
                    </p>
                  ))}
                </div>
              )}

              <div style={styles.actions}>
                <Link to={`/directors/${director._id}`} style={styles.buttonView}>
                  Ver Detalles
                </Link>
                {isAdmin() && (
                  <>
                    <Link to={`/directors/edit/${director._id}`} style={styles.buttonEdit}>
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(director._id)}
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

      {directors.length === 0 && (
        <div style={styles.empty}>
          <p>No se encontraron directores</p>
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
  searchForm: {
    display: 'flex',
    gap: '0.5rem',
    margin: '0 auto 2rem',
    padding: '0 1rem'
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
    padding: '0 1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
  photo: {
    width: '100%',
    height: '250px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  directorName: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  nationality: {
    color: '#666',
    fontSize: '1rem',
    margin: '0.25rem 0'
  },
  age: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.25rem 0'
  },
  bio: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: '1rem 0'
  },
  awards: {
    background: '#fff9e6',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem'
  },
  awardsTitle: {
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: '0.5rem'
  },
  award: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.25rem 0'
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