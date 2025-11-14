import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MoviesList } from './pages/MoviesList';
import { MovieDetail } from './pages/MovieDetail';
import { DirectorsList } from './pages/DirectorsList';
import { DirectorDetail } from './pages/DirectorDetail';
import { MovieForm } from './pages/MovieForm';
import { DirectorForm } from './pages/DirectorForm';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<MoviesList />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/directors" element={<DirectorsList />} />

            {/* Rutas protegidas (solo admin) */}
            <Route
              path="/movies/create"
              element={
                <ProtectedRoute adminOnly>
                  <MovieForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <MovieForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/directors/create"
              element={
                <ProtectedRoute adminOnly>
                  <DirectorForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/directors/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <DirectorForm />
                </ProtectedRoute>
              }
            />
            <Route path="/directors/:id" element={<DirectorDetail />} />


            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={styles.notFound}>
                  <h1>404</h1>
                  <p>Página no encontrada</p>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  placeholder: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  },
  notFound: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }
};

export default App;