const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/auth');
const upload = require('../Middlewares/upload');
const {
  crearEmprendimiento,
  listarEmprendimientos,
  actualizarEmprendimiento,
  eliminarEmprendimiento,
  obtenerPorUsuario,
  obtenerPorId  
} = require('../Controllers/emprendimientos.controller');

// GET /api/emprendimientos (público)
router.get('/', listarEmprendimientos);

// POST /api/emprendimientos (protegido)
router.post('/', verificarToken, upload.single('imagen'), crearEmprendimiento);

// PUT /api/emprendimientos/:id (protegido, solo dueño o admin)
router.put('/:id', verificarToken, upload.single('imagen'), actualizarEmprendimiento);

// DELETE /api/emprendimientos/:id (protegido, solo dueño o admin)
router.delete('/:id', verificarToken, eliminarEmprendimiento);


router.get('/:id', obtenerPorId);

router.get('/usuario/:id_usuario', verificarToken, obtenerPorUsuario);

module.exports = router;