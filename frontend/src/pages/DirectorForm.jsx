import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { directorService } from '../services/api';

export const DirectorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthDate: '',
    nationality: '',
    biography: '',
    isActive: true,
    awards: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [awardInput, setAwardInput] = useState({
    name: '',
    year: '',
    category: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadDirector();
    }
  }, [id]);

  const loadDirector = async () => {
    try {
      const response = await directorService.getById(id);
      const director = response.data.data.director;
      setFormData({
        name: director.name,
        lastName: director.lastName,
        birthDate: director.birthDate ? director.birthDate.split('T')[0] : '',
        nationality: director.nationality,
        biography: director.biography || '',
        isActive: director.isActive !== undefined ? director.isActive : true,
        awards: director.awards || []
      });
    } catch (err) {
      setError('Error cargando el director');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAwardChange = (e) => {
    const { name, value } = e.target;
    setAwardInput({
      ...awardInput,
      [name]: value
    });
  };

  const handleAddAward = () => {
    if (awardInput.name.trim() && awardInput.year) {
      setFormData({
        ...formData,
        awards: [
          ...formData.awards,
          {
            name: awardInput.name.trim(),
            year: parseInt(awardInput.year),
            category: awardInput.category.trim()
          }
        ]
      });
      setAwardInput({ name: '', year: '', category: '' });
    }
  };

  const handleRemoveAward = (index) => {
    setFormData({
      ...formData,
      awards: formData.awards.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const directorData = {
        ...formData
      };

      if (isEditMode) {
        await directorService.update(id, directorData);
      } else {
        await directorService.create(directorData);
      }

      navigate('/directors');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el director');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isEditMode ? '✏️ Editar Director' : '➕ Nuevo Director'}
        </h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Christopher"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Apellido *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Nolan"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nacionalidad *</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Británico"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Biografía</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              style={styles.textarea}
              rows="6"
              placeholder="Director conocido por sus narrativas complejas y efectos visuales innovadores..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Director activo
            </label>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏆 Premios y Reconocimientos</h3>
            
            <div style={styles.awardForm}>
              <div style={styles.awardRow}>
                <input
                  type="text"
                  name="name"
                  value={awardInput.name}
                  onChange={handleAwardChange}
                  style={styles.input}
                  placeholder="Nombre del premio (ej: Oscar)"
                />
                <input
                  type="number"
                  name="year"
                  value={awardInput.year}
                  onChange={handleAwardChange}
                  style={styles.inputSmall}
                  placeholder="Año"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <input
                  type="text"
                  name="category"
                  value={awardInput.category}
                  onChange={handleAwardChange}
                  style={styles.input}
                  placeholder="Categoría (ej: Mejor Director)"
                />
                <button
                  type="button"
                  onClick={handleAddAward}
                  style={styles.addButton}
                >
                  + Agregar
                </button>
              </div>
            </div>

            <div style={styles.awardsList}>
              {formData.awards.map((award, index) => (
                <div key={index} style={styles.awardItem}>
                  <div style={styles.awardInfo}>
                    <strong>{award.name}</strong> - {award.category} ({award.year})
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAward(index)}
                    style={styles.removeButton}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/directors')}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Director')}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  inputSmall: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    width: '120px'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  section: {
    background: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#333'
  },
  awardForm: {
    marginBottom: '1rem'
  },
  awardRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 120px 2fr auto',
    gap: '0.5rem',
    alignItems: 'center'
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
  awardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  awardItem: {
    background: '#fff9e6',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid #f39c12'
  },
  awardInfo: {
    flex: 1
  },
  removeButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
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