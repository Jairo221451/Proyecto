import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { registerUser } from '../services/api';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registerUser({ nombre, email, contrasena, confirmarContrasena });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <h2 style={{ color: 'var(--primary-color)' }}>Regístrate en LocaLink</h2>
          <p className="text-muted">Únete a nuestra comunidad</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Registrarse
          </Button>
          
          <div className="text-center">
            <p className="text-muted">
              ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--primary-color)' }}>Inicia sesión</a>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;