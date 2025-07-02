const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Verificar configuración de Cloudinary
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'emprendimientos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { 
        width: 800, 
        height: 600, 
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ],
    // Generar URL segura (HTTPS)
    secure: true,
    // Configuración adicional para mejor compatibilidad
    resource_type: 'image',
    public_id: (req, file) => {
      // Generar un public_id único
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `emprendimiento_${timestamp}_${originalName}`;
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    console.log('Archivo recibido en multer:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Verificar tipo de archivo
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Middleware para logging de uploads
const uploadWithLogging = (req, res, next) => {
  const originalSingle = upload.single('imagen');
  
  originalSingle(req, res, (err) => {
    if (err) {
      console.error('Error en upload de Cloudinary:', err);
      return res.status(400).json({ 
        error: err.message,
        details: 'Error al subir imagen a Cloudinary'
      });
    }
    
    if (req.file) {
      console.log('Archivo subido exitosamente a Cloudinary:', {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        public_id: req.file.public_id
      });
      
      // Asegurar que la URL sea HTTPS
      if (req.file.path && req.file.path.startsWith('http://')) {
        req.file.path = req.file.path.replace('http://', 'https://');
      }
    }
    
    next();
  });
};

module.exports = upload;
module.exports.uploadWithLogging = uploadWithLogging;