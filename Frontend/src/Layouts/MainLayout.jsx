import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Sidebar from '../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import './MainLayout.css'; // Aquí se importa el CSS separado

const MainLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar cuando se cambia de móvil a desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Manejar tema oscuro
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  // Prevenir scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Cerrar sidebar al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('sidebar-overlay')) {
      closeSidebar();
    }
  };

  // Cerrar sidebar con la tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <>
      <div className="main-layout-container">
        {/* Botón hamburguesa para móvil */}
        {isMobile && (
          <button
            className={`mobile-menu-toggle ${sidebarOpen ? 'active' : ''}`}
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={sidebarOpen}
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}

        {/* Overlay para cerrar sidebar en móvil */}
        {isMobile && (
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
            onClick={handleOverlayClick}
            role="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
          />
        )}

        <div className={`sidebar-container ${sidebarOpen ? 'show' : ''} ${isMobile ? 'transitioning' : ''}`}>
          <Sidebar darkMode={darkMode} closeSidebar={closeSidebar} isMobile={isMobile} />
        </div>                  

        <div className={`main-content-area ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="content-area">
            <Container fluid>
              <Row>
                <Col className="py-4">
                  <Outlet />
                </Col>
              </Row>
            </Container>
          </div>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </>
  );
};

export default MainLayout;