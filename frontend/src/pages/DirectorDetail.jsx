import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { directorService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DirectorDetail = () => {
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDirector();
  }, [id]);

  const loadDirector = async () => {
    try {
      setLoading(true);
      const response = await directorService.getById(id);
      setDirector(response.data.data.director);
    } catch (err) {
      setError('Error al cargar el director');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este director?')) {
      return;
    }

    try {
      await directorService.delete(id);
      navigate('/directors');
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
    return <div style={styles.loading}>Cargando director...</div>;
  }

  if (error || !director) {
    return (
      <div style={styles.errorContainer}>
        <p>{error || 'Director no encontrado'}</p>
        <Link to="/directors" style={styles.buttonBack}>Volver a directores</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.photoSection}>
          <img
            src={director.photo || 'https://via.placeholder.com/400x400?text=Director'}
            alt={director.fullName}
            style={styles.photo}
          />
        </div>

        <div style={styles.infoSection}>
          <h1 style={styles.title}>{director.name} {director.lastName}</h1>

          <div style={styles.meta}>
            <span style={styles.metaItem}>🌍 {director.nationality}</span>
            {director.birthDate && (
              <span style={styles.metaItem}>
                🎂 {calculateAge(director.birthDate)} años
              </span>
            )}
            <span style={styles.metaItem}>
              {director.isActive ? '✅ Activo' : '⛔ Inactivo'}
            </span>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Biografía</h2>
            <p style={styles.biography}>{director.biography || 'Sin biografía disponible'}</p>
          </div>

          {director.awards && director.awards.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🏆 Premios y Reconocimientos</h2>
              <div style={styles.awardsList}>
                {director.awards.map((award, i) => (
                  <div key={i} style={styles.awardItem}>
                    <strong>{award.name}</strong> - {award.category} ({award.year})
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <Link to="/directors" style={styles.buttonBackAction}>← Volver</Link>
            {isAdmin() && (
              <>
                <Link to={`/directors/edit/${director._id}`} style={styles.buttonEdit}>
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
    maxWidth: '1000px',
    background: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '2rem'
  },
  photoSection: {
    background: '#667eea'
  },
  photo: {
    width: '100%',
    height: '400px',
    objectFit: 'cover'
  },
  infoSection: {
    padding: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1rem'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: '#666',
    fontSize: '1rem'
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
  biography: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#555'
  },
  awardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  awardItem: {
    background: '#fff9e6',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #f39c12'
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
  }
};