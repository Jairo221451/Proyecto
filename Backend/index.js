require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuración CORS mejorada - AGREGADO EL MÉTODO PATCH
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://localink-production.up.railway.app',
    'https://res.cloudinary.com' // Agregar dominio de Cloudinary
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ← AGREGADO PATCH
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'x-access-token',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Cache-Control',
    'Pragma'
  ]
}));

// Headers mejorados para recursos externos
app.use((req, res, next) => {
  // Headers CORS básicos - AGREGADO PATCH
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // ← AGREGADO PATCH
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Headers para recursos externos (imágenes de Cloudinary)
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Headers de seguridad para imágenes
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');
  res.header('X-Content-Type-Options', 'nosniff');
  
  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
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

// Ruta de prueba para verificar URLs de Cloudinary
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    message: 'Cloudinary test endpoint',
    cloudinary_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/sample.jpg`
  });
});

// Manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headers: req.headers
  });
  
  // Si es error de multer (subida de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo es demasiado grande' });
  }
  
  if (err.message && err.message.includes('imagen')) {
    return res.status(400).json({ error: err.message });
  }
  
  // Error de Cloudinary
  if (err.name === 'CloudinaryError') {
    return res.status(400).json({ error: 'Error al procesar la imagen' });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Cloudinary configurado para: ${process.env.CLOUDINARY_CLOUD_NAME}`);
});

// Endpoint para probar las URLs de las imágenes
app.get('/api/test-images', async (req, res) => {
  try {
    const db = require('./Database/connection');
    
    const [emprendimientos] = await db.query(`
      SELECT id_emprendimiento, nombre, imagen_url 
      FROM emprendimientos 
      WHERE imagen_url IS NOT NULL 
      LIMIT 5
    `);
    
    const testResults = emprendimientos.map(emp => {
      let imagenUrl = emp.imagen_url;
      
      // Procesar URL
      if (imagenUrl && imagenUrl.startsWith('http://')) {
        imagenUrl = imagenUrl.replace('http://', 'https://');
      }
      
      return {
        id: emp.id_emprendimiento,
        nombre: emp.nombre,
        original_url: emp.imagen_url,
        processed_url: imagenUrl,
        is_cloudinary: imagenUrl ? imagenUrl.includes('cloudinary.com') : false,
        is_https: imagenUrl ? imagenUrl.startsWith('https://') : false
      };
    });
    
    res.json({
      message: 'Test de URLs de imágenes',
      cloudinary_config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        base_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
      },
      test_results: testResults
    });
    
  } catch (error) {
    console.error('Error en test de imágenes:', error);
    res.status(500).json({ error: error.message });
  }
});