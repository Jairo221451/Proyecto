const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/auth');
const {
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  listarComentarios
} = require('../Controllers/comentarios.controller');

// POST /api/comentarios (protegido)
router.post('/', verificarToken, crearComentario);

// GET /api/comentarios/:id_emprendimiento (público)
router.get('/:id_emprendimiento', listarComentarios);

// PUT /api/comentarios/:id (protegido, solo dueño o admin)
router.put('/:id', verificarToken, actualizarComentario);

// DELETE /api/comentarios/:id (protegido, solo dueño o admin)
router.delete('/:id', verificarToken, eliminarComentario);

module.exports = router;