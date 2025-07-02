import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLink, FaImage, FaExclamationCircle } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import '../index.css';

const CrearEmprendimiento = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Este campo es obligatorio'),
    descripcion: Yup.string().required('Este campo es obligatorio'),
    celular: Yup.string()
      .required('Este campo es obligatorio')
      .matches(/^[0-9]+$/, 'Solo números permitidos'),
    imagen: Yup.mixed()
      .required('La imagen es obligatoria')
      .test('fileSize', 'La imagen debe ser menor a 5MB', (value) => 
        value && value.size <= 5 * 1024 * 1024
      ),
    facebook_url: Yup.string().url('Ingresa una URL válida'),
    instagram_url: Yup.string().url('Ingresa una URL válida'),
    otra_red_social: Yup.string().url('Ingresa una URL válida')
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      descripcion: '',
      celular: '',
      facebook_url: '',
      instagram_url: '',
      otra_red_social: '',
      imagen: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      const user = JSON.parse(localStorage.getItem('user'));

      Object.entries(values).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('id_usuario', user.id);

      try {
        await api.post('/emprendimientos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/mis-emprendimientos');
      } catch (err) {
        setError(err.response?.data?.error || 'Error al crear emprendimiento');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="text-white py-3" style={{ 
          background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
          border: 'none'
        }}>
          <h2 className="mb-0">
            <FaImage className="me-2" /> Crear Nuevo Emprendimiento
          </h2>
        </Card.Header>

        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={formik.handleSubmit}>
            {/* Sección de Información Básica */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Información Básica</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Emprendimiento *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.nombre && formik.errors.nombre}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.nombre}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.descripcion && formik.errors.descripcion}
                />
                {formik.touched.descripcion && formik.errors.descripcion && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.descripcion}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono/Celular *</Form.Label>
                <Form.Control
                  type="tel"
                  name="celular"
                  value={formik.values.celular}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.celular && formik.errors.celular}
                />
                {formik.touched.celular && formik.errors.celular && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.celular}
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            {/* Sección de Redes Sociales */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Redes Sociales (Opcionales)</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaFacebook className="me-2" /> Facebook
                </Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://facebook.com/tuemprendimiento"
                  name="facebook_url"
                  value={formik.values.facebook_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.facebook_url && formik.errors.facebook_url}
                />
                {formik.touched.facebook_url && formik.errors.facebook_url && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.facebook_url}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaInstagram className="me-2" /> Instagram
                </Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://instagram.com/tuemprendimiento"
                  name="instagram_url"
                  value={formik.values.instagram_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.instagram_url && formik.errors.instagram_url}
                />
                {formik.touched.instagram_url && formik.errors.instagram_url && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.instagram_url}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaLink className="me-2" /> Otra Red Social
                </Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://ejemplo.com/tuemprendimiento"
                  name="otra_red_social"
                  value={formik.values.otra_red_social}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.otra_red_social && formik.errors.otra_red_social}
                />
                {formik.touched.otra_red_social && formik.errors.otra_red_social && (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.otra_red_social}
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            {/* Sección de Imagen */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Imagen Principal *</h5>
              <Form.Group>
                <Form.Label>
                  <FaImage className="me-2" /> Subir Imagen
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => formik.setFieldValue('imagen', e.currentTarget.files[0])}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.imagen && formik.errors.imagen}
                />
                {formik.touched.imagen && formik.errors.imagen ? (
                  <Form.Text className="text-danger">
                    <FaExclamationCircle /> {formik.errors.imagen}
                  </Form.Text>
                ) : (
                  <Form.Text className="text-muted">
                    Formatos: JPG, PNG. Máx. 5MB
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                size="lg"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
                  border: 'none'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Creando...
                  </>
                ) : (
                  'Crear Emprendimiento'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CrearEmprendimiento;