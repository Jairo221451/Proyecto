import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ConfiguracionUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombre: '', correo: '', esAdmin: false });

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [contrasenaActual, setContrasenaActual] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');

  // Detectar si estamos en modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Función para obtener el color de fondo apropiado
  const getBackgroundColor = () => {
    return isDarkMode ? '#1a1a1a' : 'var(--light-color)'; // Usa tu variable CSS
  };

  // Detectar cambios en el tema
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-bs-theme');
      setIsDarkMode(theme === 'dark');
    };

    // Verificar tema inicial
    checkTheme();

    // Observar cambios en el atributo data-bs-theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Configuración de SweetAlert2 según el tema
  const getSwalConfig = (type = 'default') => {
    const baseConfig = {
      background: isDarkMode ? '#2a2a2a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#333333',
      confirmButtonColor: '#6a5acd',
      cancelButtonColor: isDarkMode ? '#6c757d' : '#6c757d',
    };

    if (type === 'danger') {
      return {
        ...baseConfig,
        confirmButtonColor: '#dc3545',
      };
    }

    return baseConfig;
  };

  // Función para determinar el rol del usuario
  const getRolUsuario = () => {
    if (usuario.esAdmin === true) {
      return 'Administrador';
    }
    return 'Usuario';
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Asegurar que esAdmin sea un booleano
      const userWithAdmin = {
        ...user,
        esAdmin: Boolean(user.esAdmin)
      };
      setUsuario(userWithAdmin);
      setNuevoNombre(user.nombre || '');
      setNuevoCorreo(user.correo || '');
    }
  }, []);

  const handleActualizarPerfil = async () => {
    try {
      const cambios = [];
      const body = {
        nombre: nuevoNombre,
        correo: nuevoCorreo,
        contrasena_actual: contrasenaActual,
      };

      if (nuevoNombre !== usuario.nombre) cambios.push('nombre');
      if (nuevoCorreo !== usuario.correo) cambios.push('correo electrónico');

      await api.put('/auth/configuracion', body);

      // Guardar nuevo user en localStorage
      const userActualizado = { ...usuario, nombre: nuevoNombre, correo: nuevoCorreo };
      localStorage.setItem('user', JSON.stringify(userActualizado));
      setUsuario(userActualizado);

      const mensajeFinal = cambios.length
        ? `${cambios.join(' y ')} actualizado${cambios.length > 1 ? 's' : ''} correctamente`
        : 'Perfil actualizado correctamente';

      Swal.fire({
        title: 'Éxito',
        text: mensajeFinal,
        icon: 'success',
        ...getSwalConfig()
      });

      // Limpiar campo de contraseña actual
      setContrasenaActual('');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Error al actualizar el perfil',
        icon: 'error',
        ...getSwalConfig()
      });
    }
  };

  const handleCambiarContrasena = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        ...getSwalConfig()
      });
      return;
    }

    if (!contrasenaActual) {
      Swal.fire({
        title: 'Error',
        text: 'Debes ingresar tu contraseña actual',
        icon: 'error',
        ...getSwalConfig()
      });
      return;
    }

    try {
      const body = {
        nombre: nuevoNombre,
        correo: nuevoCorreo,
        contrasena_actual: contrasenaActual,
        nueva_contrasena: nuevaContrasena,
      };

      await api.put('/auth/configuracion', body);

      Swal.fire({
        title: 'Éxito',
        text: 'Contraseña actualizada correctamente',
        icon: 'success',
        ...getSwalConfig()
      });

      // Limpiar campos de contraseña
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Error al cambiar la contraseña',
        icon: 'error',
        ...getSwalConfig()
      });
    }
  };

  const handleEliminarCuenta = async () => {
    const resultado = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esto también eliminará todos tus emprendimientos. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      ...getSwalConfig('danger')
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete('/auth/eliminar-cuenta');
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la cuenta.',
          icon: 'error',
          ...getSwalConfig()
        });
      }
    }
  };

  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: getBackgroundColor() }}>
      <Container style={{ maxWidth: '1200px' }}>
        <h1 className="mb-4 text-center">Mi Perfil</h1>

        {mensaje && <Alert variant={tipoMensaje} className="mb-4">{mensaje}</Alert>}

        <Row className="g-4">
          {/* Información Personal */}
          <Col lg={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Información Personal</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      placeholder="Ingresa tu nombre"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={nuevoCorreo}
                      onChange={(e) => setNuevoCorreo(e.target.value)}
                      placeholder="Ingresa tu email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Rol</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        value={getRolUsuario()}
                        disabled
                      />
                      {Boolean(usuario.esAdmin) && (
                        <span className="admin-badge ms-2">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña Actual</Form.Label>
                    <Form.Control
                      type="password"
                      value={contrasenaActual}
                      onChange={(e) => setContrasenaActual(e.target.value)}
                      placeholder="Necesaria para confirmar cambios"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    onClick={handleActualizarPerfil}
                    style={{ width: '140px' }}
                  >
                    Editar Perfil
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Cambiar Contraseña */}
          <Col lg={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Cambiar Contraseña</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña Actual</Form.Label>
                    <Form.Control
                      type="password"
                      value={contrasenaActual}
                      onChange={(e) => setContrasenaActual(e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmarContrasena}
                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    onClick={handleCambiarContrasena}
                    style={{ width: '160px' }}
                  >
                    Cambiar Contraseña
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Zona de Peligro */}
        <Row className="mt-4">
          <Col>
            <Card className="border-danger">
              <Card.Header className="bg-danger text-white">
                <h5 className="mb-0">Eliminar Cuenta</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado ya que esta acción es permanente.
                </p>
                <Button 
                  variant="danger" 
                  onClick={handleEliminarCuenta}
                  style={{ width: '140px' }}
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ConfiguracionUsuario;