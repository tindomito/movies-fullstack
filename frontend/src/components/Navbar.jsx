import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🎬 Movies API
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Inicio</Link>
          <Link to="/movies" style={styles.link}>Películas</Link>
          <Link to="/directors" style={styles.link}>Directores</Link>

          {isAuthenticated ? (
            <>
              {isAdmin() && (
                <>
                  <Link to="/movies/create" style={styles.linkAdmin}>+ Película</Link>
                  <Link to="/directors/create" style={styles.linkAdmin}>+ Director</Link>
                </>
              )}
              <span style={styles.user}>👤 {user?.username}</span>
              <button onClick={handleLogout} style={styles.button}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.button}>Iniciar Sesión</Link>
              <Link to="/register" style={styles.buttonSecondary}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  container: {
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  linkAdmin: {
    color: '#ffd700',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  user: {
    color: 'white',
    fontSize: '0.9rem'
  },
  button: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  buttonSecondary: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500'
  }
};