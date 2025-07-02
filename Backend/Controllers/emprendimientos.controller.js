const Emprendimiento = require('../Models/Emprendimiento');
const cloudinary = require('../config/cloudinary');
const db = require('../Database/connection');

const crearEmprendimiento = async (req, res) => {
  try {
    const { id_usuario, nombre, descripcion, celular } = req.body;
    
    console.log('Datos recibidos:', { id_usuario, nombre, descripcion, celular });
    console.log('Archivo recibido:', req.file);
    
    // La URL de Cloudinary viene en req.file.path
    const imagenUrl = req.file ? req.file.path : null;

    if (imagenUrl) {
      console.log('URL de imagen generada:', imagenUrl);
    }

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

    res.status(201).json({
      ...emprendimiento,
      mensaje: 'Emprendimiento creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear emprendimiento:', error);
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

    // Procesar URLs de imágenes para asegurar HTTPS
    const emprendimientosConImagenes = emprendimientos.map(emp => ({
      ...emp,
      imagen_url: emp.imagen_url && emp.imagen_url.startsWith('http://') 
        ? emp.imagen_url.replace('http://', 'https://') 
        : emp.imagen_url
    }));

    console.log('Emprendimientos con imágenes:', emprendimientosConImagenes.map(e => ({
      id: e.id_emprendimiento,
      nombre: e.nombre,
      imagen_url: e.imagen_url
    })));

    // Headers para permitir imágenes externas
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json(emprendimientosConImagenes);
  } catch (error) {
    console.error('Error al listar emprendimientos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para extraer public_id de URL de Cloudinary
const extractPublicId = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return null;
  
  try {
    // Extraer el public_id de la URL de Cloudinary
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // El public_id está después de la versión (si existe) o directamente después de upload
    let publicIdPart = parts.slice(uploadIndex + 1).join('/');
    
    // Remover parámetros de transformación si existen
    const transformationIndex = publicIdPart.indexOf('/');
    if (transformationIndex !== -1) {
      // Si hay transformaciones, tomar todo después de ellas
      const segments = publicIdPart.split('/');
      publicIdPart = segments[segments.length - 1];
    }
    
    // Remover la extensión y versión si existe
    const fileNameWithoutExtension = publicIdPart.split('.')[0];
    
    return fileNameWithoutExtension;
  } catch (error) {
    console.error('Error extrayendo public_id:', error);
    return null;
  }
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
      console.log('Nueva imagen subida:', imagenUrl);
      
      // Eliminar imagen anterior de Cloudinary si existe
      if (emprendimiento.imagen_url) {
        try {
          const publicId = extractPublicId(emprendimiento.imagen_url);
          console.log('Eliminando imagen anterior, public_id:', publicId);
          if (publicId) {
            const result = await cloudinary.uploader.destroy(`emprendimientos/${publicId}`);
            console.log('Resultado eliminación:', result);
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

    res.json({ mensaje: 'Emprendimiento actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar emprendimiento:', error);
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
        console.log('Eliminando imagen, public_id:', publicId);
        if (publicId) {
          const result = await cloudinary.uploader.destroy(`emprendimientos/${publicId}`);
          console.log('Resultado eliminación:', result);
        }
      } catch (error) {
        console.log('Error al eliminar imagen de Cloudinary:', error.message);
      }
    }

    await Emprendimiento.eliminar(id);
    res.json({ mensaje: 'Emprendimiento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar emprendimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerMasValorados = async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.obtenerMasValorados();
    
    // Asegurar HTTPS en URLs de imágenes
    const emprendimientosConImagenes = emprendimientos.map(emp => ({
      ...emp,
      imagen_url: emp.imagen_url && emp.imagen_url.startsWith('http://') 
        ? emp.imagen_url.replace('http://', 'https://') 
        : emp.imagen_url
    }));

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json(emprendimientosConImagenes);
  } catch (error) {
    console.error('Error al obtener más valorados:', error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerUltimo = async (req, res) => {
  try {
    const emprendimiento = await Emprendimiento.obtenerUltimo();
    
    // Asegurar HTTPS en URL de imagen
    if (emprendimiento && emprendimiento.imagen_url && emprendimiento.imagen_url.startsWith('http://')) {
      emprendimiento.imagen_url = emprendimiento.imagen_url.replace('http://', 'https://');
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json(emprendimiento);
  } catch (error) {
    console.error('Error al obtener último emprendimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const emprendimientos = await Emprendimiento.obtenerPorUsuario(id_usuario);
    
    // Asegurar HTTPS en URLs de imágenes
    const emprendimientosConImagenes = emprendimientos.map(emp => ({
      ...emp,
      imagen_url: emp.imagen_url && emp.imagen_url.startsWith('http://') 
        ? emp.imagen_url.replace('http://', 'https://') 
        : emp.imagen_url
    }));

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json(emprendimientosConImagenes);
  } catch (error) {
    console.error('Error al obtener emprendimientos por usuario:', error);
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

    // Asegurar HTTPS en URL de imagen
    if (emprendimiento.imagen_url && emprendimiento.imagen_url.startsWith('http://')) {
      emprendimiento.imagen_url = emprendimiento.imagen_url.replace('http://', 'https://');
    }

    console.log('Emprendimiento obtenido:', {
      id: emprendimiento.id_emprendimiento,
      nombre: emprendimiento.nombre,
      imagen_url: emprendimiento.imagen_url
    });

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json(emprendimiento);
  } catch (error) {
    console.error('Error al obtener emprendimiento por ID:', error);
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