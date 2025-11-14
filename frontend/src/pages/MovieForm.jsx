import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { movieService, directorService } from '../services/api';

export const MovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    year: new Date().getFullYear(),
    genre: [],
    duration: '',
    rating: '',
    synopsis: '',
    budget: '',
    boxOffice: '',
    language: '',
    country: 'Argentina'
  });
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genreInput, setGenreInput] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    loadDirectors();
    if (isEditMode) {
      loadMovie();
    }
  }, [id]);

  const loadDirectors = async () => {
    try {
      const response = await directorService.getAll();
      setDirectors(response.data.data.directors);
    } catch (err) {
      console.error('Error cargando directores:', err);
    }
  };

  const loadMovie = async () => {
    try {
      const response = await movieService.getById(id);
      const movie = response.data.data;
      setFormData({
        title: movie.title,
        director: movie.director._id,
        year: movie.year,
        genre: movie.genre || [],
        duration: movie.duration,
        rating: movie.rating || '',
        synopsis: movie.synopsis || '',
        budget: movie.budget || '',
        boxOffice: movie.boxOffice || '',
        language: movie.language || 'Español',
        country: movie.country || 'Argentina'
      });
    } catch (err) {
      setError('Error cargando la película');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genre: [...formData.genre, genreInput.trim()]
      });
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData({
      ...formData,
      genre: formData.genre.filter(g => g !== genreToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.genre.length === 0) {
      setError('Debe agregar al menos un género');
      setLoading(false);
      return;
    }

    try {
      const movieData = {
        ...formData,
        year: parseInt(formData.year),
        duration: parseInt(formData.duration),
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        budget: formData.budget ? parseInt(formData.budget) : undefined,
        boxOffice: formData.boxOffice ? parseInt(formData.boxOffice) : undefined
      };

      if (isEditMode) {
        await movieService.update(id, movieData);
      } else {
        await movieService.create(movieData);
      }

      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la película');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isEditMode ? '✏️ Editar Película' : '➕ Nueva Película'}
        </h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Inception"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Director *</label>
              <select
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Seleccionar director</option>
                {directors.map(director => (
                  <option key={director._id} value={director._id}>
                    {director.name} {director.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Año *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 5}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duración (minutos) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                style={styles.input}
                placeholder="148"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Rating (0-10)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                style={styles.input}
                placeholder="8.8"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Géneros *</label>
            <div style={styles.genreContainer}>
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                style={styles.input}
                placeholder="Ej: Ciencia Ficción"
              />
              <button
                type="button"
                onClick={handleAddGenre}
                style={styles.addButton}
              >
                + Agregar
              </button>
            </div>
            <div style={styles.genreList}>
              {formData.genre.map((genre, index) => (
                <span key={index} style={styles.genreTag}>
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    style={styles.removeButton}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sinopsis</label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              style={styles.textarea}
              rows="5"
              placeholder="Un ladrón que se infiltra en los sueños..."
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Idioma</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>País</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Presupuesto ($)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                style={styles.input}
                placeholder="160000000"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Recaudación ($)</label>
              <input
                type="number"
                name="boxOffice"
                value={formData.boxOffice}
                onChange={handleChange}
                min="0"
                style={styles.input}
                placeholder="836800000"
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Película')}
            </button>
          </div>
        </form>
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
  card: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#333',
    textAlign: 'center'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '5px',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#555'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  genreContainer: {
    display: 'flex',
    gap: '0.5rem'
  },
  addButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  genreList: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  genreTag: {
    background: '#e8eaf6',
    color: '#667eea',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  cancelButton: {
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};