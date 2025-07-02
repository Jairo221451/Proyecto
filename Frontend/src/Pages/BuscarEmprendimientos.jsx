import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, 
  Form, Button, Spinner, Alert,
  InputGroup
} from 'react-bootstrap';
import { FaSearch, FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../index.css';

const BuscarEmprendimientos = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/emprendimientos/buscar?q=${term}`);
      setResults(response.data);
    } catch (err) {
      setError('Error al buscar emprendimientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">Buscar Emprendimientos</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Buscar por nombre, descripción..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <Button 
            variant="primary" 
            type="submit"
            disabled={!term.trim() || loading}
            style={{
              background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
              border: 'none'
            }}
          >
            {loading ? <Spinner size="sm" /> : <FaSearch />}
          </Button>
        </InputGroup>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {results.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {results.map((emprendimiento) => (
            <Col key={emprendimiento.id_emprendimiento}>
              <Card className="card-custom h-100">
                <Card.Img
                  variant="top"
                  src={`http://localhost:3001${emprendimiento.imagen_url}`}
                  className="card-img-custom"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{emprendimiento.nombre}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {emprendimiento.descripcion.substring(0, 100)}...
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(`/emprendimiento/${emprendimiento.id_emprendimiento}`)}
                  >
                    Ver más
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        !loading && term && (
          <Alert variant="info" className="text-center">
            No se encontraron resultados para "{term}"
          </Alert>
        )
      )}
    </Container>
  );
};

export default BuscarEmprendimientos;