import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import logo from '../assets/Localink.png';
import './Navbar.css';

const CustomNavbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Función mejorada para obtener la inicial del nombre
  const getInitial = () => {
    if (!user?.nombre) return 'U'; // 'U' de Usuario por defecto
    
    // Limpiar espacios y obtener primera letra
    const cleanName = user.nombre.trim();
    if (cleanName.length === 0) return 'U';
    
    return cleanName.charAt(0).toUpperCase();
  };

  // Función para verificar si es admin de forma robusta
  const esAdmin = () => {
    return Boolean(user?.esAdmin === true || user?.esAdmin === 1 || user?.esAdmin === "1");
  };

  return (
    <Navbar expand="lg" className={`modern-navbar shadow-sm ${darkMode ? 'dark' : 'light'}`}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="modern-brand">
          <img src={logo} alt="LocaLink" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="modern-toggler">
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="modern-nav-link">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/emprendimientos" className="modern-nav-link">
              Emprendimientos
            </Nav.Link>
            <Nav.Link as={Link} to="/acerca-de" className="modern-nav-link">
              Acerca de
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Button onClick={toggleDarkMode} className="dark-mode-btn me-3" size="sm">
              <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span>
              {darkMode ? 'Claro' : 'Oscuro'}
            </Button>

            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/mis-emprendimientos"
                  className="modern-nav-link me-2"
                >
                  Mis Emprendimientos
                </Nav.Link>

                <Dropdown as={Nav.Item} align="end">
                  <Dropdown.Toggle as="a" className="modern-dropdown-toggle">
                    <div className="user-avatar">
                      {getInitial()}
                    </div>
                    <span className="ms-2">{user?.nombre || 'Usuario'}</span>
                    {esAdmin() && (
                      <span className="admin-badge ms-2">Admin</span>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="modern-dropdown-menu">
                    <Dropdown.Item as={Link} to="/crear-emprendimiento" className="modern-dropdown-item">
                      <i className="bi bi-plus-circle me-2"></i> Crear Emprendimiento
                    </Dropdown.Item>

                    {esAdmin() && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          as={Link} 
                          to="/admin/reportes" 
                          className="modern-dropdown-item"
                        >
                          <i className="bi bi-shield-lock me-2"></i> Panel de Admin
                        </Dropdown.Item>
                      </>
                    )}

                    <Dropdown.Item as={Link} to="/configuracion" className="modern-dropdown-item">
                      <i className="bi bi-gear me-2"></i> Configuración
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="modern-dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="auth-buttons">
                <Button as={Link} to="/login" variant="outline-primary" className="modern-btn-outline me-2">
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/register" variant="primary" className="modern-btn-primary">
                  Registrarse
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;