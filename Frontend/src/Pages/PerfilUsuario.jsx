import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getEmprendimientos } from '../services/api';

const Home = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmprendimientos();
        setEmprendimientos(response.data);
      } catch (error) {
        console.error('Error fetching emprendimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4 text-center">Emprendimientos Destacados</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {emprendimientos.map((emprendimiento) => (
          <Col key={emprendimiento.id_emprendimiento}>
            <Card className="card-custom h-100">
              {emprendimiento.imagen_url && (
                <Card.Img 
                  variant="top" 
                  src={`http://localhost:3001${emprendimiento.imagen_url}`} 
                  alt={emprendimiento.nombre}
                  className="card-img-top"
                />
              )}
              <Card.Body>
                <Card.Title>{emprendimiento.nombre}</Card.Title>
                <Card.Text className="text-muted">
                  {emprendimiento.descripcion.substring(0, 100)}...
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <small className="text-muted">
                  {emprendimiento.celular && `Contacto: ${emprendimiento.celular}`}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;