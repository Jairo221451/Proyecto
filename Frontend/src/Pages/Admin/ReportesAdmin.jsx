import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getReportes, resolverReporte, eliminarEmprendimiento } from '../../services/reportesService';

const ReportesAdmin = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [action, setAction] = useState('');

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const { data } = await getReportes();
      setReportes(data);
    } catch (err) {
      setError('Error al cargar reportes');
      toast.error(err.response?.data?.error || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const handleAction = (reporte, accion) => {
    setSelectedReporte(reporte);
    setAction(accion);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (action === 'resolver') {
        await resolverReporte(selectedReporte.id_reporte, 'resuelto');
        await eliminarEmprendimiento(selectedReporte.id_emprendimiento);
        toast.success('Reporte aceptado y emprendimiento eliminado');
      } else {
        await resolverReporte(selectedReporte.id_reporte, 'rechazado');
        toast.success('Reporte rechazado');
      }
      cargarReportes();
    } catch (err) {
      toast.error('Error al procesar la acción');
    } finally {
      setShowModal(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <span style={{ 
            background: 'linear-gradient(to right, #00b4db, #0083b0, #6a11cb, #2575fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Panel de Reportes
          </span>
          {' '}📋
        </h2>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {reportes.length > 0 ? (
          reportes.map((reporte) => (
            <Col key={reporte.id_reporte}>
              <Card className="h-100 shadow-sm border-0" style={{ borderTop: '4px solid #6a11cb' }}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg={
                      reporte.estado === 'pendiente' ? 'primary' : 
                      reporte.estado === 'resuelto' ? 'success' : 'secondary'
                    }>
                      {reporte.estado}
                    </Badge>
                    <small className="text-muted">
                      #{reporte.id_reporte}
                    </small>
                  </div>
                  
                  <Card.Title className="mb-3" style={{ color: '#2575fc' }}>{reporte.nombre_emprendimiento}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    Reportado por: {reporte.nombre_reportador}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    <strong>Motivo:</strong> {reporte.motivo}
                  </Card.Text>
                  
                  {reporte.estado === 'pendiente' && (
                    <div className="d-flex gap-2 mt-auto">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAction(reporte, 'resolver')}
                        className="flex-grow-1"
                        style={{ background: 'linear-gradient(to right, #00b4db, #0083b0)', border: 'none' }}
                      >
                        ✅ Aceptar y Eliminar
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleAction(reporte, 'rechazar')}
                        className="flex-grow-1"
                        style={{ borderColor: '#6a11cb', color: '#6a11cb' }}
                      >
                        ❌ Rechazar
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="text-center" style={{ background: 'linear-gradient(to right, #e0f7fa, #f3e5f5)', color: '#6a11cb' }}>
              Aún no hay reportes
            </Alert>
          </Col>
        )}
      </Row>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(to right, #00b4db, #6a11cb)', color: 'white' }}>
          <Modal.Title>
            {action === 'resolver' ? 'Aceptar Reporte' : 'Rechazar Reporte'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {action === 'resolver' ? (
            <>
              <p>¿Aceptar este reporte y eliminar el emprendimiento asociado?</p>
              <p className="text-danger fw-bold">Esta acción no se puede deshacer.</p>
            </>
          ) : (
            <p>¿Estás seguro de rechazar este reporte?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)}
            style={{ borderColor: '#6a11cb', color: '#6a11cb' }}
          >
            Cancelar
          </Button>
          <Button 
            variant={action === 'resolver' ? 'primary' : 'secondary'} 
            onClick={confirmAction}
            style={action === 'resolver' ? 
              { background: 'linear-gradient(to right, #00b4db, #0083b0)', border: 'none' } : 
              { background: 'linear-gradient(to right, #6a11cb, #2575fc)', border: 'none' }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportesAdmin;