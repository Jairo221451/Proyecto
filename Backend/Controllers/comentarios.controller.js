const Comentario = require('../Models/Comentario');
const db = require('../Database/connection');

const crearComentario = async (req, res) => {
  try {
    const { id_emprendimiento, contenido, puntuacion } = req.body;
    const id_usuario = req.user.id; // Obtiene el ID del token

    // Validaciones
    if (!id_emprendimiento || !contenido || !puntuacion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ error: 'La puntuación debe ser entre 1 y 5' });
    }
    if (contenido.length < 5) {
      return res.status(400).json({ error: 'El comentario es demasiado corto' });
    }

    // Verificar si el emprendimiento existe
    const [emprendimiento] = await db.query(
      'SELECT id_emprendimiento FROM emprendimientos WHERE id_emprendimiento = ?',
      [id_emprendimiento]
    );
    if (!emprendimiento) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    const comentarioId = await Comentario.crear(id_emprendimiento, id_usuario, contenido, puntuacion);
    res.status(201).json({ id_comentario: comentarioId, mensaje: 'Comentario creado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, puntuacion } = req.body;

    // Validar que el comentario exista y pertenezca al usuario
    const comentario = await Comentario.obtenerPorId(id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    if (comentario.id_usuario !== req.user.id && !req.user.esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para editar este comentario' });
    }

    await Comentario.actualizar(id, contenido, puntuacion);
    res.json({ mensaje: 'Comentario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el comentario exista y pertenezca al usuario
    const comentario = await Comentario.obtenerPorId(id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    if (comentario.id_usuario !== req.user.id && !req.user.esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }

    await Comentario.eliminar(id);
    res.json({ mensaje: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarComentarios = async (req, res) => {
  try {
    const { id_emprendimiento } = req.params;
    const comentarios = await Comentario.listarPorEmprendimiento(id_emprendimiento);
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  listarComentarios
};