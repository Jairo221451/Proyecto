const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../Middlewares/auth');
const Usuario = require('../Models/Usuario');
const Reporte = require('../Models/Reporte');
const Emprendimiento = require('../Models/Emprendimiento');

// Obtener todos los usuarios
router.get('/usuarios', verificarToken, esAdmin, async (req, res) => {
  try {
    const [usuarios] = await db.query('SELECT id_usuario, nombre, email, es_admin, esta_activo FROM usuarios');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de usuario
router.put('/usuarios/:id', verificarToken, esAdmin, async (req, res) => {
  try {
    const { esta_activo } = req.body;
    await db.query('UPDATE usuarios SET esta_activo = ? WHERE id_usuario = ?', [esta_activo, req.params.id]);
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener reportes pendientes (ya lo tienes en reportes.routes.js)
// Puedes reutilizar el endpoint existente

// Resolver reportes (ya implementado)

// Obtener todos los emprendimientos
router.get('/emprendimientos', verificarToken, esAdmin, async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.listarTodos();
    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de emprendimiento
router.put('/emprendimientos/:id', verificarToken, esAdmin, async (req, res) => {
  try {
    const { esta_activo } = req.body;
    await Emprendimiento.actualizarEstado(req.params.id, esta_activo);
    res.json({ mensaje: 'Emprendimiento actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;