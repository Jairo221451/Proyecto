const Emprendimiento = require('../Models/Emprendimiento');
const upload = require('../Middlewares/upload');
const db = require('../Database/connection');
const fs = require('fs');
const path = require('path');

const crearEmprendimiento = async (req, res) => {
  try {
    const { id_usuario, nombre, descripcion, celular } = req.body;
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

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

// const listarEmprendimientos = async (req, res) => {
//   try {
//     const emprendimientos = await Emprendimiento.listar();
//     res.json(emprendimientos);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Actualizar emprendimiento (nuevo)
const actualizarEmprendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, celular } = req.body;
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Validar propiedad
    const result = await db.query(
      'SELECT id_usuario FROM emprendimientos WHERE id_emprendimiento = ?',
      [id]
    );
    const emprendimiento = result[0][0]; // Tomar el primer elemento del array


    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }
    if (emprendimiento.id_usuario !== req.user.id && !req.user.esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para editar este emprendimiento' });
    }
    

    // Eliminar imagen anterior si se sube una nueva
    if (imagenUrl) {
      const [oldEmprendimiento] = await db.query(
        'SELECT imagen_url FROM emprendimientos WHERE id_emprendimiento = ?',
        [id]
      );
      if (oldEmprendimiento.imagen_url) {
        fs.unlinkSync(path.join(__dirname, '../Public', oldEmprendimiento.imagen_url));
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

// Eliminar emprendimiento (nuevo)
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

    // Eliminar imagen asociada
    if (emprendimiento.imagen_url) {
      try {
        const imagePath = path.join(__dirname, '../Public', emprendimiento.imagen_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.log('Error al eliminar imagen:', error.message);
        // Continuamos con la eliminación del emprendimiento aunque falle la imagen
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