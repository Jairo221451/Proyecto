const Emprendimiento = require('../Models/Emprendimiento');
const cloudinary = require('../config/cloudinary');
const db = require('../Database/connection');

const crearEmprendimiento = async (req, res) => {
  try {
    const { id_usuario, nombre, descripcion, celular } = req.body;
    
    // La URL de Cloudinary viene en req.file.path
    const imagenUrl = req.file ? req.file.path : null;

    const emprendimiento = await Emprendimiento.crear(
      id_usuario,
      nombre,
      descripcion,
      imagenUrl,
      celular,
      req.body.facebook_url,
      req.body.instagram_url,
      req.body.otra_red_social
    );

    res.status(201).json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar emprendimiento para tambien obtener el promedio de calificaciones en base a las estrellas
const listarEmprendimientos = async (req, res) => {
  try {
    const [emprendimientos] = await db.query(`
      SELECT 
        e.*, 
        ROUND(AVG(c.puntuacion), 1) AS promedio_puntuacion
      FROM 
        emprendimientos e
      LEFT JOIN 
        comentarios c ON e.id_emprendimiento = c.id_emprendimiento
      WHERE 
        e.esta_activo = 1
      GROUP BY 
        e.id_emprendimiento
    `);

    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para extraer public_id de URL de Cloudinary
const extractPublicId = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return null;
  
  // Extraer el public_id de la URL de Cloudinary
  const parts = imageUrl.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  
  // El public_id está después de la versión (si existe) o directamente después de upload
  let publicIdPart = parts.slice(uploadIndex + 1).join('/');
  
  // Remover parámetros de transformación si existen
  if (publicIdPart.includes('/')) {
    const segments = publicIdPart.split('/');
    // El último segmento es el nombre del archivo, los anteriores pueden ser transformaciones
    publicIdPart = segments[segments.length - 1];
  }
  
  // Remover la extensión
  return publicIdPart.split('.')[0];
};

// Actualizar emprendimiento
const actualizarEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, celular } = req.body;
    
    // Validar propiedad
    const result = await db.query(
      'SELECT id_usuario, imagen_url FROM emprendimientos WHERE id_emprendimiento = ?',
      [id]
    );
    const emprendimiento = result[0][0];

    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }
    if (emprendimiento.id_usuario !== req.user.id && !req.user.esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para editar este emprendimiento' });
    }

    let imagenUrl = undefined;

    // Si se sube una nueva imagen
    if (req.file) {
      imagenUrl = req.file.path; // URL de Cloudinary
      
      // Eliminar imagen anterior de Cloudinary si existe
      if (emprendimiento.imagen_url) {
        try {
          const publicId = extractPublicId(emprendimiento.imagen_url);
          if (publicId) {
            await cloudinary.uploader.destroy(`emprendimientos/${publicId}`);
          }
        } catch (error) {
          console.log('Error al eliminar imagen anterior de Cloudinary:', error.message);
        }
      }
    }

    await Emprendimiento.actualizar(
      id,
      nombre,
      descripcion,
      imagenUrl,
      celular,
      req.body.facebook_url,
      req.body.instagram_url,
      req.body.otra_red_social
    );

    res.json({ mensaje: 'Emprendimiento actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar emprendimiento
const eliminarEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar propiedad
    const [rows] = await db.query(
      'SELECT id_usuario, imagen_url FROM emprendimientos WHERE id_emprendimiento = ?',
      [id]
    );
    const emprendimiento = rows[0];

    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }
    if (emprendimiento.id_usuario !== req.user.id && !req.user.esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este emprendimiento' });
    }

    // Eliminar imagen de Cloudinary si existe
    if (emprendimiento.imagen_url) {
      try {
        const publicId = extractPublicId(emprendimiento.imagen_url);
        if (publicId) {
          await cloudinary.uploader.destroy(`emprendimientos/${publicId}`);
        }
      } catch (error) {
        console.log('Error al eliminar imagen de Cloudinary:', error.message);
      }
    }

    await Emprendimiento.eliminar(id);
    res.json({ mensaje: 'Emprendimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerMasValorados = async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.obtenerMasValorados();
    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerUltimo = async (req, res) => {
  try {
    const emprendimiento = await Emprendimiento.obtenerUltimo();
    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const emprendimientos = await Emprendimiento.obtenerPorUsuario(id_usuario);
    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendimiento = await Emprendimiento.obtenerPorId(id);
    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }
    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearEmprendimiento,
  listarEmprendimientos,
  actualizarEmprendimiento,
  obtenerUltimo,
  obtenerPorUsuario,
  obtenerMasValorados,
  eliminarEmprendimiento,
  obtenerPorId
};