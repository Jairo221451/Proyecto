import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, contrasena: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <h2 style={{ color: 'var(--primary-color)' }}>Iniciar Sesión</h2>
          <p className="text-muted">Ingresa a tu cuenta de LocaLink</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Iniciar Sesión
          </Button>
          
          <div className="text-center">
            <p className="text-muted">
              ¿No tienes cuenta? <a href="/register" style={{ color: 'var(--primary-color)' }}>Regístrate</a>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;