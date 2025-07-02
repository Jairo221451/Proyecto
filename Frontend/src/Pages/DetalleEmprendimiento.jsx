import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Card, Spinner, Form, Button, Alert, 
  Row, Col, Badge, ListGroup, Modal
} from 'react-bootstrap';
import { 
  FaStar, FaRegStar, FaPhone, FaFacebook, 
  FaInstagram, FaLink, FaUser, FaArrowLeft, FaFlag 
} from 'react-icons/fa';
import api from '../services/api';
import '../index.css';

const DetalleEmprendimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [contenido, setContenido] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporteMotivo, setReporteMotivo] = useState('');
  const [reporteError, setReporteError] = useState('');

  // Función para cargar datos del emprendimiento y comentarios
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEmprendimiento, resComentarios] = await Promise.all([
        api.get(`/emprendimientos/${id}`),
        api.get(`/comentarios/${id}`)
      ]);
      
      setEmprendimiento(resEmprendimiento.data);
      setComentarios(resComentarios.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setMensaje('Error al cargar los datos del emprendimiento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Función para manejar el envío de comentarios
  const handleEnviarComentario = async () => {
    if (puntuacion < 1 || puntuacion > 5) {
      setMensaje('Selecciona una puntuación entre 1 y 5 estrellas');
      return;
    }

    if (contenido.trim().length < 5) {
      setMensaje('El comentario debe tener al menos 5 caracteres');
      return;
    }

    try {
      await api.post('/comentarios', {
        id_emprendimiento: id,
        contenido,
        puntuacion,
      });

      setMensaje('¡Comentario enviado con éxito!');
      setContenido('');
      setPuntuacion(0);
      // Recargar comentarios después de enviar uno nuevo
      const res = await api.get(`/comentarios/${id}`);
      setComentarios(res.data);
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al enviar comentario');
    }
  };

  // Función para manejar el reporte
const handleReportar = async () => {
  if (reporteMotivo.length < 10) {
    setReporteError('El motivo debe tener al menos 10 caracteres');
    return;
  }

  try {
    await api.post('/reportes', {
      id_emprendimiento: id,
      motivo: reporteMotivo
    });

    setReporteError('');
    setReporteMotivo('');
    setShowReportModal(false);
    setMensaje('Reporte enviado correctamente. Gracias por tu feedback.');
  } catch (err) {
    setReporteError(err.response?.data?.error || 'Error al enviar reporte');
  }
};

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!emprendimiento) {
    return (
      <Container className="my-4">
        <Alert variant="danger">No se pudo cargar el emprendimiento</Alert>
      </Container>
    );
  }

  // Calcular puntuación promedio
  const promedioPuntuacion = comentarios.length > 0 
    ? (comentarios.reduce((acc, c) => acc + c.puntuacion, 0) / comentarios.length)
    : 0;

  return (
    <Container className="my-4">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        <FaArrowLeft /> Volver
      </Button>

      {/* Botón para reportar */}
      <Button 
        variant="outline-danger" 
        onClick={() => setShowReportModal(true)}
        className="ms-2 mb-3"
      >
        <FaFlag /> Reportar
      </Button>

      <Card className="shadow-sm border-0">
        <Row className="g-0">
          {/* Columna de la imagen */}
          <Col md={5}>
            <Card.Img
              src={`http://localhost:3001${emprendimiento.imagen_url}`}
              className="img-fluid rounded-start"
              style={{ 
                maxHeight: '400px',
                objectFit: 'cover',
                width: '100%'
              }}
            />
          </Col>

          {/* Columna de información */}
          <Col md={7}>
            <Card.Body>
              {/* Header con nombre y usuario */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title as="h2" className="mb-1">
                    {emprendimiento.nombre}
                  </Card.Title>
                  <Card.Subtitle className="text-muted mb-3">
                    <FaUser className="me-1" />
                    Publicado por: {emprendimiento.nombre_usuario || 'Anónimo'}
                  </Card.Subtitle>
                </div>
                <Badge 
                  bg="primary" 
                  style={{ 
                    background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
                    fontSize: '1rem'
                  }}
                >
                  ⭐ {promedioPuntuacion.toFixed(1) || 'Nuevo'}
                </Badge>
              </div>

              {/* Descripción */}
              <Card.Text className="my-3">
                {emprendimiento.descripcion}
              </Card.Text>

              {/* Contacto y redes sociales */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header 
                  className="text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)'
                  }}
                >
                  <h5 className="mb-0">Información de Contacto</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {emprendimiento.celular && (
                      <ListGroup.Item>
                        <FaPhone className="me-2" /> 
                        <a href={`tel:${emprendimiento.celular}`}>
                          {emprendimiento.celular}
                        </a>
                      </ListGroup.Item>
                    )}
                    {emprendimiento.facebook_url && (
                      <ListGroup.Item>
                        <FaFacebook className="me-2 text-primary" /> 
                        <a 
                          href={emprendimiento.facebook_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Facebook
                        </a>
                      </ListGroup.Item>
                    )}
                    {emprendimiento.instagram_url && (
                      <ListGroup.Item>
                        <FaInstagram className="me-2 text-danger" /> 
                        <a 
                          href={emprendimiento.instagram_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Instagram
                        </a>
                      </ListGroup.Item>
                    )}
                    {emprendimiento.otra_red_social && (
                      <ListGroup.Item>
                        <FaLink className="me-2 text-success" /> 
                        <a 
                          href={emprendimiento.otra_red_social} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Sitio Web
                        </a>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Valoración con estrellas */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header 
                  className="text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)'
                  }}
                >
                  <h5 className="mb-0">Deja tu valoración</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Puntuación</Form.Label>
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="link"
                          onClick={() => setPuntuacion(star)}
                          style={{ padding: '0 5px' }}
                        >
                          {star <= puntuacion ? (
                            <FaStar className="text-warning" size={24} />
                          ) : (
                            <FaRegStar className="text-warning" size={24} />
                          )}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                    />
                  </Form.Group>
                  <Button 
                    onClick={handleEnviarComentario}
                    style={{
                      background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
                      border: 'none'
                    }}
                  >
                    Enviar Valoración
                  </Button>
                  {mensaje && (
                    <Alert variant={mensaje.includes('Error') ? 'danger' : 'success'} className="mt-3">
                      {mensaje}
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* Lista de comentarios */}
              <h5 className="mb-3">
                Comentarios ({comentarios.length})
              </h5>
              {comentarios.length === 0 ? (
                <Alert variant="info">Aún no hay comentarios</Alert>
              ) : (
                <ListGroup>
                  {comentarios.map((c, i) => (
                    <ListGroup.Item key={i} className="mb-2 rounded shadow-sm">
                      <div className="d-flex justify-content-between">
                        <strong>{c.nombre_usuario || 'Anónimo'}</strong>
                        <div>
                          {[...Array(5)].map((_, starIdx) => (
                            starIdx < c.puntuacion ? 
                              <FaStar key={starIdx} className="text-warning" /> : 
                              <FaRegStar key={starIdx} className="text-warning" />
                          ))}
                        </div>
                      </div>
                      <p className="mb-0 mt-1">{c.contenido}</p>
                      <small className="text-muted">
                        {new Date(c.fecha_creacion).toLocaleDateString()}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Modal para reportar */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reportar Emprendimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo del reporte</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reporteMotivo}
              onChange={(e) => setReporteMotivo(e.target.value)}
              placeholder="Describe el problema que has encontrado..."
            />
            {reporteError && <Alert variant="danger" className="mt-2">{reporteError}</Alert>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger"
            onClick={handleReportar}
          >
            Enviar Reporte
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetalleEmprendimiento;