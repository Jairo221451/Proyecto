import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card, Spinner } from 'react-bootstrap';
import api from '../services/api';

const EditarEmprendimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [celular, setCelular] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [otraRedSocial, setOtraRedSocial] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEmprendimiento = async () => {
      try {
        const response = await api.get(`/emprendimientos/${id}`);
        const emp = response.data;
        
        setEmprendimiento(emp);
        setNombre(emp.nombre);
        setDescripcion(emp.descripcion);
        setCelular(emp.celular);
        setFacebookUrl(emp.facebook_url || '');
        setInstagramUrl(emp.instagram_url || '');
        setOtraRedSocial(emp.otra_red_social || '');
        // CORREGIDO: Ahora usa directamente la URL de Cloudinary
        if (emp.imagen_url) {
          setImagenPreview(emp.imagen_url);
        }
      } catch (err) {
        setError('Error al cargar el emprendimiento');
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendimiento();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('celular', celular);
      formData.append('facebook_url', facebookUrl);
      formData.append('instagram_url', instagramUrl);
      formData.append('otra_red_social', otraRedSocial);
      if (imagen) formData.append('imagen', imagen);

      await api.put(`/emprendimientos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Emprendimiento actualizado correctamente');
      setTimeout(() => navigate('/mis-emprendimientos'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar emprendimiento');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (!emprendimiento) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">Emprendimiento no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Editar Emprendimiento</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Emprendimiento</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Contacto</Form.Label>
              <Form.Control
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Facebook URL (Opcional)</Form.Label>
              <Form.Control
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/tu-pagina"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instagram URL (Opcional)</Form.Label>
              <Form.Control
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/tu-pagina"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Otra Red Social (Opcional)</Form.Label>
              <Form.Control
                type="url"
                value={otraRedSocial}
                onChange={(e) => setOtraRedSocial(e.target.value)}
                placeholder="URL de otra red social"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              {imagenPreview && (
                <div className="mb-2">
                  <img 
                    src={imagenPreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Sube una nueva imagen si deseas cambiar la actual
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/mis-emprendimientos')}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditarEmprendimiento;