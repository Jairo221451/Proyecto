import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { 
  FiHome, FiBriefcase, FiUser, FiSettings, 
  FiLogOut, FiPlusCircle, FiShield, FiStar,
  FiMapPin, FiHeart, FiShoppingBag, FiCalendar
} from 'react-icons/fi';
import logo from '../assets/Localink.png'; // Asegúrate de que la ruta sea correcta
import './Sidebar.css';

const Sidebar = ({ darkMode, closeSidebar, isMobile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para verificar el estado de autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      setIsLoggedIn(!!token);
      setUser(userData ? JSON.parse(userData) : null);
      setIsLoading(false);
    };

    checkAuthStatus();

    // Escuchar cambios en localStorage (para actualizaciones en tiempo real)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Verificar cada vez que el componente se monta
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Función para obtener las iniciales del usuario
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Función para manejar clicks en enlaces (cerrar sidebar en móvil)
  const handleLinkClick = () => {
    if (isMobile && closeSidebar) {
      closeSidebar();
    }
  };

  if (isLoading) {
    return (
      <div className={`sidebar ${darkMode ? 'dark' : ''} ${isLoading ? 'loading' : ''}`}>
        <div className="sidebar-brand">
          <h3>LocaLink</h3>
          <small>Cargando...</small>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
      {/* Brand section */}
      <div className="sidebar-brand">
        <h3>LocaLink</h3>
        <small>Conectando comunidades</small>
      </div>

      {/* Welcome/Auth Card */}
      {isLoggedIn ? (
        <Card className="welcome-card">
          <Card.Body>
            <div className="user-info mb-3">
              <div className="user-avatar-large mb-2">
                {getUserInitials(user?.nombre)}
              </div>
              <h5>¡Hola, {user?.nombre || 'Usuario'}!</h5>
            </div>
            <p>Bienvenido de vuelta a LocaLink</p>
            <Button 
              as={Link} 
              to="/emprendimientos" 
              variant="outline-primary" 
              className="btn-modern mb-2"
              onClick={handleLinkClick}
            >
              🏪 Explorar Emprendimientos
            </Button>
            <Button 
              as={Link} 
              to="/mis-emprendimientos" 
              variant="outline-primary" 
              className="btn-modern"
              onClick={handleLinkClick}
            >
              📊 Mis Emprendimientos
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="login-card">
          <Card.Body>
            <h5>¡Únete a LocaLink!</h5>
            <p>Descubre y apoya emprendimientos locales en tu comunidad</p>
            <Button 
              as={Link} 
              to="/register" 
              variant="primary" 
              className="btn-login mb-2"
              onClick={handleLinkClick}
            >
              ✨ Registrarse
            </Button>
            <Button 
              as={Link} 
              to="/login" 
              variant="outline-primary" 
              className="btn-login"
              onClick={handleLinkClick}
            >
              🚀 Iniciar Sesión
            </Button>
          </Card.Body>
        </Card>
      )}
      
      {/* Info Card */}
      <Card className="info-card">
        <Card.Body>
          <h6>💡 ¿Qué es LocaLink?</h6>
          <p className="small">
            Una plataforma innovadora para descubrir, conectar y apoyar 
            emprendimientos locales en tu comunidad. Fortalecemos la economía 
            local conectando emprendedores con clientes cercanos.
          </p>
        </Card.Body>
      </Card>

      {/* Features Card */}
      <Card className="features-card">
        <Card.Body>
          <h6 className="features-title">🌟 Características</h6>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span className="feature-text">Descubre negocios locales</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span className="feature-text">Conecta con emprendedores</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span className="feature-text">Apoya tu comunidad</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span className="feature-text">Crea tu emprendimiento</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span className="feature-text">Eventos y promociones</span>
          </div>
        </Card.Body>
      </Card>

      {/* Tips Card */}
      <Card className="features-card">
        <Card.Body>
          <h6 className="features-title">💭 Consejos</h6>
          <p className="small">
            {isLoggedIn 
              ? "Completa tu perfil y añade fotos de calidad para atraer más clientes."
              : "Regístrate gratis y comienza a promocionar tu emprendimiento hoy mismo."
            }
          </p>
        </Card.Body>
      </Card>

      {/* Botón para cerrar en móvil (opcional) */}
      {isMobile && (
        <div className="text-center mt-3">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={closeSidebar}
            className="btn-close-sidebar"
          >
            ✕ Cerrar menú
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;