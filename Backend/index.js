require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Public', 'uploads')));

// Rutas
const authRoutes = require('./Routes/auth.routes');
const emprendimientoRoutes = require('./Routes/emprendimientos.routes');
const comentarioRoutes = require('./Routes/comentarios.routes');
const reporteRoutes = require('./Routes/reportes.routes');
const adminRoutes = require('./Routes/admin.routes');
app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/reportes', reporteRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});