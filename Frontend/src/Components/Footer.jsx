import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`modern-footer ${darkMode ? 'dark' : 'light'}`}>
      {/* Sección principal del footer */}
      <div className="footer-main">
        <Container>
          <Row className="g-4">
            {/* Columna de la marca */}
            <Col lg={4} md={6}>
              <div className="footer-brand">
                <h5 className="brand-title">LocaLink</h5>
                <p className="brand-description">
                  Conectando emprendimientos locales con su comunidad. 
                  Descubre, apoya y haz crecer los negocios de tu zona.
                </p>                
              </div>
            </Col>

            {/* Enlaces rápidos */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">Enlaces Rápidos</h6>
                <ul className="footer-links">
                  <li><Link to="/">Inicio</Link></li>
                  <li><Link to="/emprendimientos">Emprendimientos</Link></li>
                  <li><Link to="/acerca-de">Acerca de</Link></li>
                  <li><Link to="/contacto">Contacto</Link></li>
                  {/* <li><Link to="/about">Acerca de</Link></li>
                  <li><Link to="/contact">Contacto</Link></li> */}
                </ul>
              </div>
            </Col>

            {/* Para emprendedores */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">Emprendedores</h6>
                <ul className="footer-links">
                  <li><Link to="/register">Registrarse</Link></li>
                  <li><Link to="/crear-emprendimiento">Crear Emprendimiento</Link></li>
                  <li><Link to="/recursos">Recursos</Link></li>
                  <li><Link to="/ayuda">Ayuda</Link></li>
                </ul>
              </div>
            </Col>

            {/* Soporte */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">Soporte</h6>
                <ul className="footer-links">
                  <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                  <li><Link to="/terminos-uso">Términos de Uso</Link></li>
                  <li><Link to="/privacidad">Privacidad</Link></li>
                  <li><Link to="/reportar-problema">Reportar Problema</Link></li>
                </ul>
              </div>
            </Col>          
          </Row>
        </Container>
      </div>

      {/* Sección inferior del footer */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright-text">
                © {currentYear} LocaLink. Todos los derechos reservados.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;