import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const Ayuda = () => {
  return (
    <Container className="my-5">
      <h2>Centro de Ayuda</h2>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Cómo registro mi emprendimiento?</Accordion.Header>
          <Accordion.Body>
            Primero debes registrarte e iniciar sesión. Luego ve a "Crear Emprendimiento" desde tu perfil.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Puedo editar o eliminar mi emprendimiento?</Accordion.Header>
          <Accordion.Body>
            Sí. Desde "Mis Emprendimientos" puedes editar o eliminar cualquier emprendimiento que hayas creado.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>¿Cómo contacto con el soporte técnico?</Accordion.Header>
          <Accordion.Body>
            Puedes escribirnos desde la sección <strong>Contacto</strong> o enviar un correo a soporte@localink.com.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Ayuda;
