const db = require('../Database/connection');

class Reporte {
    static async crear(id_emprendimiento, id_usuario_reportador, motivo) {
        const [result] = await db.query(
            `INSERT INTO reportes 
            (id_emprendimiento, id_usuario_reportador, motivo) 
            VALUES (?, ?, ?)`,
            [id_emprendimiento, id_usuario_reportador, motivo]
        );
        return result.insertId;
    }

    static async listarPendientes() {
        const [rows] = await db.query(
            `SELECT r.*, e.nombre as nombre_emprendimiento, u.nombre as nombre_reportador
            FROM reportes r
            INNER JOIN emprendimientos e ON r.id_emprendimiento = e.id_emprendimiento
            INNER JOIN usuarios u ON r.id_usuario_reportador = u.id_usuario
            WHERE r.estado = 'pendiente'`
        );
        return rows;
    }

    static async actualizarEstado(id_reporte, estado, id_admin_resolutor) {
    await db.query(
        `UPDATE reportes 
        SET estado = ?, 
            id_admin_resolutor = ?, 
            fecha_resolucion = CURRENT_TIMESTAMP 
        WHERE id_reporte = ?`,
        [estado, id_admin_resolutor, id_reporte]
    );
    
    const [reporte] = await db.query(`
        SELECT r.*, 
            e.nombre as nombre_emprendimiento,
            u.nombre as nombre_reportador
        FROM reportes r
        JOIN emprendimientos e ON r.id_emprendimiento = e.id_emprendimiento
        JOIN usuarios u ON r.id_usuario_reportador = u.id_usuario
        WHERE r.id_reporte = ?
    `, [id_reporte]);
    
    return reporte[0];
}
}

module.exports = Reporte;