import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setNombre('');
    setMensaje('');
  };

  return (
    <Container className="my-5">
      <h2>Contacto</h2>
      <p>¿Tienes preguntas, sugerencias o necesitas ayuda? ¡Escríbenos!</p>

      {enviado && <Alert variant="success">Mensaje enviado con éxito.</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Enviar</Button>
      </Form>

      <hr className="my-4" />

      <h4>Síguenos en redes sociales</h4>
      <div className="d-flex gap-4 fs-4 mt-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
          <FaFacebook />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
          <FaInstagram />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
          <FaTwitter />
        </a>
        <a href="mailto:contacto@localink.com" title="Correo">
          <FaEnvelope />
        </a>
      </div>
    </Container>
  );
};

export default Contacto;


// import React, { useState } from 'react';
// import { Container, Form, Button, Alert } from 'react-bootstrap';

// const Contacto = () => {
//   const [nombre, setNombre] = useState('');
//   const [mensaje, setMensaje] = useState('');
//   const [enviado, setEnviado] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Aquí podrías enviar a backend o correo, por ahora simulamos:
//     setEnviado(true);
//     setNombre('');
//     setMensaje('');
//   };

//   return (
//     <Container className="my-5">
//       <h2>Contacto</h2>
//       <p>¿Tienes preguntas, sugerencias o necesitas ayuda? ¡Escríbenos!</p>

//       {enviado && <Alert variant="success">Mensaje enviado con éxito.</Alert>}

//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>Nombre</Form.Label>
//           <Form.Control
//             type="text"
//             value={nombre}
//             onChange={(e) => setNombre(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Mensaje</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={4}
//             value={mensaje}
//             onChange={(e) => setMensaje(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Button type="submit">Enviar</Button>
//       </Form>
//     </Container>
//   );
// };

// export default Contacto;
