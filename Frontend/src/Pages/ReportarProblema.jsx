import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ReportarProblema = () => {
  const [descripcion, setDescripcion] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setDescripcion('');
  };

  return (
    <Container className="my-5">
      <h2>Reportar un Problema</h2>
      <p>¿Encontraste un error en la plataforma? Cuéntanos para poder solucionarlo.</p>

      {enviado && <Alert variant="success">Reporte enviado. ¡Gracias por tu ayuda!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Describe el problema</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Enviar Reporte</Button>
      </Form>
    </Container>
  );
};

export default ReportarProblema;
