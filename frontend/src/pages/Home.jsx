import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🎬 Bienvenido a Movies API</h1>
        <p style={styles.subtitle}>
          Gestiona tu catálogo de películas y directores
        </p>

        {isAuthenticated ? (
          <div style={styles.welcome}>
            <h2>¡Hola, {user?.username}! 👋</h2>
            <p>Rol: <strong>{isAdmin() ? 'Administrador' : 'Usuario'}</strong></p>
          </div>
        ) : (
          <div style={styles.actions}>
            <Link to="/login" style={styles.button}>
              Iniciar Sesión
            </Link>
            <Link to="/register" style={styles.buttonSecondary}>
              Registrarse
            </Link>
          </div>
        )}
      </div>

      <div style={styles.features}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎥 Películas</h3>
          <p style={styles.cardText}>
            Explora nuestro catálogo completo de películas.
          </p>
          <Link to="/movies" style={styles.cardLink}>
            Ver Películas →
          </Link>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎭 Directores</h3>
          <p style={styles.cardText}>
            Conoce a los directores más destacados del cine.
          </p>
          <Link to="/directors" style={styles.cardLink}>
            Ver Directores →
          </Link>
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
  hero: {
    textAlign: 'center',
    padding: '3rem 1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '15px',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9
  },
  welcome: {
    marginTop: '2rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  button: {
    background: 'white',
    color: '#667eea',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  buttonSecondary: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    margin: '0 auto'
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem'
  },
  cardText: {
    color: '#666',
    marginBottom: '1.5rem'
  },
  cardLink: {
    color: '#667eea',
    fontWeight: '500'
  }
};