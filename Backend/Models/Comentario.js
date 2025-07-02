const db = require('../Database/connection');

class Comentario {
    static async crear(id_emprendimiento, id_usuario, contenido, puntuacion) {
        const [result] = await db.query(
            `INSERT INTO comentarios 
            (id_emprendimiento, id_usuario, contenido, puntuacion) 
            VALUES (?, ?, ?, ?)`,
            [id_emprendimiento, id_usuario, contenido, puntuacion]
        );
        return result.insertId;
    }

    static async listarPorEmprendimiento(id_emprendimiento) {
        const [rows] = await db.query(
            `SELECT c.*, u.nombre as nombre_usuario 
            FROM comentarios c
            JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.id_emprendimiento = ?`,
            [id_emprendimiento]
        );
        return rows;
    }

    static async obtenerPorId(id_comentario) {
        const [rows] = await db.query(
            'SELECT * FROM comentarios WHERE id_comentario = ?',
            [id_comentario]
        );
        return rows[0];
    }

    static async actualizar(id_comentario, contenido, puntuacion) {
        await db.query(
            'UPDATE comentarios SET contenido = ?, puntuacion = ? WHERE id_comentario = ?',
            [contenido, puntuacion, id_comentario]
        );
    }

    static async eliminar(id_comentario) {
        await db.query(
            'DELETE FROM comentarios WHERE id_comentario = ?',
            [id_comentario]
        );
    }
}

module.exports = Comentario;