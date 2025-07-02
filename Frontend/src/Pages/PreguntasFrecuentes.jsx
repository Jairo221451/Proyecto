import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const PreguntasFrecuentes = () => {
  return (
    <Container className="my-5">
      <h2>Preguntas Frecuentes (FAQ)</h2>
      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Qué es LocaLink?</Accordion.Header>
          <Accordion.Body>
            Es una plataforma para conectar emprendedores locales con su comunidad.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Cómo puedo comenzar a usar LocaLink?</Accordion.Header>
          <Accordion.Body>
            Solo necesitas registrarte, iniciar sesión y comenzar a crear tu emprendimiento.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default PreguntasFrecuentes;
