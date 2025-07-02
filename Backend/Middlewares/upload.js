const multer = require('multer');
const path = require('path');

// Definir constantes primero
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP)'), false);
    }
    if (file.size > maxSize) {
      return cb(new Error('El archivo no puede exceder 5MB'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: maxSize // Ahora la variable está definida
  }
});

module.exports = upload;