const express = require('express');
const router = express.Router();
//const { register, login, actualizarNombre, eliminarCuenta } = require('../Controllers/auth.controller');
const { verificarToken } = require('../Middlewares/auth');

const { register, login, actualizarNombre, eliminarCuenta, actualizarConfiguracion } = require('../Controllers/auth.controller');

// Registro y Login
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (requieren token)
router.put('/actualizar-nombre', verificarToken, actualizarNombre);
router.delete('/eliminar-cuenta', verificarToken, eliminarCuenta);

router.put('/configuracion', verificarToken, actualizarConfiguracion);


module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { register, login, actualizarNombre, eliminarCuenta } = require('../Controllers/auth.controller');
// const { verificarToken } = require('../Middlewares/auth');

// // Registro y Login
// router.post('/register', register);
// router.post('/login', login);

// // Rutas protegidas (requieren token)
// router.put('/actualizar-nombre', verificarToken, actualizarNombre);
// router.delete('/eliminar-cuenta', verificarToken, eliminarCuenta);

// module.exports = router;