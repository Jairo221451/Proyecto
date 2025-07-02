const db = require('../Database/connection');

class Emprendimiento {
    static async crear(id_usuario, nombre, descripcion, imagen_url, celular, facebook_url, instagram_url, otra_red_social) {
        const [result] = await db.query(
            `INSERT INTO emprendimientos 
            (id_usuario, nombre, descripcion, imagen_url, celular, facebook_url, instagram_url, otra_red_social) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_usuario, nombre, descripcion, imagen_url, celular, facebook_url, instagram_url, otra_red_social]
        );
        return result.insertId;
    }

    static async listar() {
        const [rows] = await db.query(
            'SELECT * FROM emprendimientos WHERE esta_activo = TRUE'
        );
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query(
            'SELECT * FROM emprendimientos WHERE id_emprendimiento = ?',
            [id]
        );
        return rows[0];
    }

    static async desactivar(id) {
        await db.query(
            'UPDATE emprendimientos SET esta_activo = FALSE WHERE id_emprendimiento = ?',
            [id]
        );
    }
        static async actualizar(
        id,
        nombre,
        descripcion,
        imagen_url,
        celular,
        facebook_url,
        instagram_url,
        otra_red_social
    ) {
        await db.query(
            `UPDATE emprendimientos SET
                nombre = ?,
                descripcion = ?,
                imagen_url = COALESCE(?, imagen_url),
                celular = ?,
                facebook_url = ?,
                instagram_url = ?,
                otra_red_social = ?
            WHERE id_emprendimiento = ?`,
            [nombre, descripcion, imagen_url, celular, facebook_url, instagram_url, otra_red_social, id]
        );
    }

    static async eliminar(id) {
        await db.query(
            'DELETE FROM emprendimientos WHERE id_emprendimiento = ?',
            [id]
        );
    }
    static async obtenerUltimo() {
        const [rows] = await db.query(
            'SELECT * FROM emprendimientos WHERE esta_activo = TRUE ORDER BY fecha_creacion DESC LIMIT 1'
        );
        return rows[0];
    }
    static async obtenerMasValorados()
    {
        const [rows] = await db.query(`
        SELECT e.*, AVG(c.puntuacion) as promedio_puntuacion
        FROM emprendimientos e
        LEFT JOIN comentarios c ON e.id_emprendimiento = c.id_emprendimiento
        WHERE e.esta_activo = TRUE
        GROUP BY e.id_emprendimiento
        ORDER BY promedio_puntuacion DESC
        LIMIT 3
        `);
        return rows;
    }
    static async obtenerPorUsuario(id_usuario) {
        const [rows] = await db.query(
            'SELECT * FROM emprendimientos WHERE id_usuario = ? AND esta_activo = TRUE',
            [id_usuario]
        );
        return rows;
    }
    // Método listar (para la ruta GET /emprendimientos)
static async listar() {
  const [rows] = await db.query(`
    SELECT e.*, u.nombre as nombre_usuario, u.email as email_usuario
    FROM emprendimientos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    WHERE e.esta_activo = TRUE
  `);
  return rows;
}

// Método obtenerPorId (para la ruta GET /emprendimientos/:id)
static async obtenerPorId(id) {
  const [rows] = await db.query(`
    SELECT e.*, u.nombre as nombre_usuario, u.email as email_usuario
    FROM emprendimientos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    WHERE e.id_emprendimiento = ?
  `, [id]);
  return rows[0];
}

// Método obtenerMasValorados
static async obtenerMasValorados() {
  const [rows] = await db.query(`
    SELECT e.*, u.nombre as nombre_usuario, AVG(c.puntuacion) as promedio_puntuacion
    FROM emprendimientos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN comentarios c ON e.id_emprendimiento = c.id_emprendimiento
    WHERE e.esta_activo = TRUE
    GROUP BY e.id_emprendimiento
    ORDER BY promedio_puntuacion DESC
    LIMIT 3
  `);
  return rows;
}

// Método obtenerPorUsuario
static async obtenerPorUsuario(id_usuario) {
  const [rows] = await db.query(`
    SELECT e.*, u.nombre as nombre_usuario
    FROM emprendimientos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    WHERE e.id_usuario = ? AND e.esta_activo = TRUE
  `, [id_usuario]);
  return rows;
}
}
module.exports = Emprendimiento;