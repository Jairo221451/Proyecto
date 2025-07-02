import React from 'react';
import { Container } from 'react-bootstrap';

const Recursos = () => {
  return (
    <Container className="my-5">
      <h2>Recursos para Emprendedores</h2>
      <ul>
        <li><a href="https://www.sunat.gob.pe/" target="_blank" rel="noreferrer">Cómo formalizar tu negocio (SUNAT)</a></li>
        <li><a href="https://www.promperu.gob.pe/" target="_blank" rel="noreferrer">Apoyos y programas de PROMPERÚ</a></li>
        <li><a href="https://www.gob.pe/produce" target="_blank" rel="noreferrer">Ministerio de la Producción</a></li>
        <li><a href="https://www.ytuempresa.gob.pe/" target="_blank" rel="noreferrer">Plataforma de soporte para mypes</a></li>
      </ul>
    </Container>
  );
};

export default Recursos;
