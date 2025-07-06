import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FiHome, FiBriefcase, FiInfo, FiUser, FiSettings, 
  FiMail, FiMapPin, FiHeart, FiShield, FiHelpCircle,
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin
} from 'react-icons/fi';
import logo from '../assets/Localink.png'; // Asegúrate de tener esta ruta correcta
import './Footer.css';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`modern-footer ${darkMode ? 'dark' : 'light'}`}>
      {/* Sección principal */}
      <div className="footer-main">
        <Container>
          <Row className="g-4">
            {/* Columna de la marca (ahora con logo) */}
            <Col lg={4} md={6}>
              <div className="footer-brand">
                <div className="logo-container">
                  <img 
                    src={logo} 
                    alt="LocaLink" 
                    className="footer-logo"
                  />
                </div>
                <p className="brand-description">
                  Conectando emprendimientos locales con su comunidad.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link"><FiFacebook /></a>
                  <a href="#" className="social-link"><FiInstagram /></a>
                  <a href="#" className="social-link"><FiTwitter /></a>
                  <a href="#" className="social-link"><FiLinkedin /></a>
                </div>
              </div>
            </Col>

            {/* Enlaces rápidos (con iconos) */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">
                  <FiMapPin className="footer-icon" /> Enlaces
                </h6>
                <ul className="footer-links">
                  <li><Link to="/"><FiHome className="link-icon" /> Inicio</Link></li>
                  <li><Link to="/emprendimientos"><FiBriefcase className="link-icon" /> Emprendimientos</Link></li>
                  <li><Link to="/acerca-de"><FiInfo className="link-icon" /> Acerca de</Link></li>
                  <li><Link to="/contacto"><FiMail className="link-icon" /> Contacto</Link></li>
                </ul>
              </div>
            </Col>

            {/* Emprendedores (con iconos) */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">
                  <FiUser className="footer-icon" /> Emprendedores
                </h6>
                <ul className="footer-links">
                  <li><Link to="/register"><FiUser className="link-icon" /> Registrarse</Link></li>
                  <li><Link to="/crear-emprendimiento"><FiBriefcase className="link-icon" /> Crear</Link></li>
                  <li><Link to="/recursos"><FiHelpCircle className="link-icon" /> Recursos</Link></li>
                  <li><Link to="/ayuda"><FiHeart className="link-icon" /> Ayuda</Link></li>
                </ul>
              </div>
            </Col>

            {/* Soporte (con iconos) */}
            <Col lg={2} md={6}>
              <div className="footer-section">
                <h6 className="footer-title">
                  <FiShield className="footer-icon" /> Soporte
                </h6>
                <ul className="footer-links">
                  <li><Link to="/faq"><FiHelpCircle className="link-icon" /> FAQ</Link></li>
                  <li><Link to="/terminos-uso"><FiShield className="link-icon" /> Términos</Link></li>
                  <li><Link to="/privacidad"><FiShield className="link-icon" /> Privacidad</Link></li>
                  <li><Link to="/reportar-problema"><FiHelpCircle className="link-icon" /> Reportar</Link></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sección inferior */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="copyright-text">
                © {currentYear} <strong>LocaLink</strong>. Todos los derechos reservados.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-bottom-links">
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;