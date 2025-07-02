require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares - CORS actualizado con configuración para imágenes
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://localink-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'x-access-token',
    'Origin',
    'X-Requested-With',
    'Accept'
  ]
}));

// Headers adicionales para manejar recursos externos (imágenes de Cloudinary)
app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
  
  // Si es error de multer (subida de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo es demasiado grande' });
  }
  
  if (err.message && err.message.includes('imagen')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});