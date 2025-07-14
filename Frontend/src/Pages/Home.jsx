import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { getEmprendimientos } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [emprendimientosDestacados, setEmprendimientosDestacados] = useState([]);
  const [emprendimientosUltimos, setEmprendimientosUltimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmprendimientos();

        // Destacados (por puntuación)
        const destacados = response.data
          .filter(e => e.promedio_puntuacion !== null) // solo con estrellas
          .sort((a, b) => b.promedio_puntuacion - a.promedio_puntuacion) // orden por estrellas descendente
          .slice(0, 6); // top 6 destacados del mes

        // Últimos subidos (por fecha de creación o ID)
        const ultimos = response.data
          .sort((a, b) => b.id_emprendimiento - a.id_emprendimiento) // asumiendo que ID mayor = más reciente
          .slice(0, 6); // últimos 6 subidos

        setEmprendimientosDestacados(destacados);
        setEmprendimientosUltimos(ultimos);
      } catch (error) {
        console.error('Error fetching emprendimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Componente reutilizable para renderizar las tarjetas
  const EmprendimientoCard = ({ emprendimiento }) => (
  <Col key={emprendimiento.id_emprendimiento}>
    <Card className="card-custom h-100">
      {emprendimiento.imagen_url && (
        <Card.Img
          variant="top"
          src={emprendimiento.imagen_url}
          className="card-img-custom"
          onError={(e) => {
            e.target.onerror = null; // Evita bucles de error
            e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
          }}
        />
      )}
      <Card.Body>
        <Card.Title>{emprendimiento.nombre}</Card.Title>
        <Card.Text>
          {emprendimiento.descripcion?.substring(0, 100)}...
        </Card.Text>
        {emprendimiento.promedio_puntuacion && (
          <p className="mb-2">⭐ {parseFloat(emprendimiento.promedio_puntuacion).toFixed(1)} / 5</p>
        )}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/emprendimiento/${emprendimiento.id_emprendimiento}`)}
        >
          Ver más
        </Button>
      </Card.Body>
    </Card>
  </Col>
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Sección de Destacados */}
      <h2 className="mb-4 text-center">Emprendimientos Más Destacados del Mes ⭐</h2>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {emprendimientosDestacados.map((emprendimiento) => (
          <EmprendimientoCard key={emprendimiento.id_emprendimiento} emprendimiento={emprendimiento} />
        ))}
      </Row>

      {/* Sección de Últimos Subidos */}
      <h2 className="mb-4 text-center">Últimos Emprendimientos Subidos 🆕</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {emprendimientosUltimos.map((emprendimiento) => (
          <EmprendimientoCard key={`ultimo-${emprendimiento.id_emprendimiento}`} emprendimiento={emprendimiento} />
        ))}
      </Row>
    </Container>
  );
};

export default Home;