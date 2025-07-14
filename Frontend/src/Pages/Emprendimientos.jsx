import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, 
  Spinner, Button, Pagination, Alert,
  Form, InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import '../index.css';

const Emprendimientos = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [allEmprendimientos, setAllEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/emprendimientos');
        setAllEmprendimientos(response.data);
        
        const totalItems = response.data.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
        
        const paginated = response.data.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
        setEmprendimientos(paginated);
      } catch (err) {
        setError('Error al cargar emprendimientos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // Si no hay término de búsqueda, mostrar todos los emprendimientos
      handleClearSearch();
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    
    // Filtrar emprendimientos localmente
    const filteredResults = allEmprendimientos.filter(emprendimiento => 
      emprendimiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emprendimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setEmprendimientos(filteredResults);
    setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
    setCurrentPage(1);
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    
    // Restaurar la paginación normal
    const totalItems = allEmprendimientos.length;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    
    const paginated = allEmprendimientos.slice(0, itemsPerPage);
    setEmprendimientos(paginated);
  };

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm.trim()) {
      const filteredResults = allEmprendimientos.filter(emprendimiento => 
        emprendimiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprendimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setEmprendimientos(filteredResults);
      setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
      setCurrentPage(1);
      setIsSearching(true);
    }
  }, [searchTerm, allEmprendimientos]);

  // Actualizar la paginación cuando no estamos buscando
  useEffect(() => {
    if (!isSearching && allEmprendimientos.length > 0) {
      const paginated = allEmprendimientos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      setEmprendimientos(paginated);
    }
  }, [currentPage, allEmprendimientos, isSearching]);

  if (loading && !isSearching) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">Todos los Emprendimientos</h2>
      <p className="text-center text-muted mb-4">
        Explora nuestra comunidad de emprendedores
      </p>

      {/* Buscador */}
      <Row className="mb-4">
        <Col md={8} lg={6} className="mx-auto">
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar emprendimientos por nombre, descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: '25px 0 0 25px',
                  border: '2px solid #6a5acd',
                  paddingLeft: '20px'
                }}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={handleClearSearch}
                  style={{
                    border: '2px solid #6a5acd',
                    borderLeft: 'none',
                    borderRight: 'none'
                  }}
                >
                  <FaTimes />
                </Button>
              )}
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #6a5acd 0%, #87cefa 100%)',
                  border: 'none',
                  borderRadius: '0 25px 25px 0',
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}
              >
                {loading ? <Spinner size="sm" /> : <FaSearch />}
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {/* Indicador de búsqueda activa */}
      {isSearching && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="d-flex justify-content-between align-items-center">
              <span>
                Resultados para "<strong>{searchTerm}</strong>" ({emprendimientos.length} encontrados)
              </span>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={handleClearSearch}
              >
                Ver todos
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Buscando...</p>
        </div>
      ) : emprendimientos.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {emprendimientos.map((emprendimiento) => (
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
        <Alert variant="info" className="text-center">
          {isSearching ? 
            `No se encontraron resultados para "${searchTerm}". Intenta con otros términos de búsqueda.` :
            'No hay emprendimientos disponibles en este momento.'
          }
        </Alert>
      )}

      {/* Paginación - Solo mostrar cuando no estamos buscando */}
      {!isSearching && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)} 
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default Emprendimientos;