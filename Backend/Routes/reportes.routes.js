const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../Middlewares/auth');
const {
  crearReporte,
  resolverReporte,
  listarReportesPendientes
} = require('../Controllers/reportes.controller');

// POST /api/reportes (cualquier usuario autenticado)
router.post('/', verificarToken, crearReporte);

// GET /api/reportes (solo admin - lista reportes pendientes)
router.get('/', verificarToken, esAdmin, listarReportesPendientes);

// PATCH /api/reportes/resolver (solo admin)
router.patch('/resolver', verificarToken, esAdmin, resolverReporte);



module.exports = router;