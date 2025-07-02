const db = require('../Database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Usuario {
  // Crear usuario con contraseña encriptada   S
  static async crear(nombre, email, contrasena) {
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );
    return result.insertId;
  }

  // Obtener usuario por email (para login)    S
  static async obtenerPorEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  // Obtener usuario por ID (para configuración)
  static async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    return rows[0];
  }

  // Verificar contraseña (usado en login o actualización)   S
  static async verificarContrasena(email, contrasena) {
    const usuario = await this.obtenerPorEmail(email);
    if (!usuario) return false;
    return bcrypt.compare(contrasena, usuario.contrasena);
  }

  // Actualizar solo el nombre del usuario     S
  static async actualizarNombre(id, nuevoNombre) {
    await db.query('UPDATE usuarios SET nombre = ? WHERE id_usuario = ?', [nuevoNombre, id]);
  }

  // Actualizar múltiples campos (nombre, correo, contraseña)
  static async actualizarConfiguracion(id_usuario, { nombre, correo, nueva_contrasena }) {
    const campos = [];
    const valores = [];

    if (nombre) {
      campos.push('nombre = ?');
      valores.push(nombre);
    }

    if (correo) {
      campos.push('email = ?');
      valores.push(correo);
    }

    if (nueva_contrasena) {
      const hashed = await bcrypt.hash(nueva_contrasena, saltRounds);
      campos.push('contrasena = ?');
      valores.push(hashed);
    }

    if (campos.length === 0) return;

    valores.push(id_usuario);
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
    await db.query(sql, valores);
  }

  // Eliminar cuenta (elimina usuario y sus emprendimientos si hay ON DELETE CASCADE)
  static async eliminar(id) {
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  }
}

module.exports = Usuario;
// const db = require('../Database/connection');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// class Usuario {
//     // Crear usuario con contraseña encriptada
//     static async crear(nombre, email, contrasena) {
//         const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
//         const [result] = await db.query(
//             'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
//             [nombre, email, hashedPassword]
//         );
//         return result.insertId;
//     }

//     // Obtener usuario por email (para login)
//     static async obtenerPorEmail(email) {
//         const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
//         return rows[0];
//     }

//     // Actualizar nombre de usuario
//     static async actualizarNombre(id, nuevoNombre) {
//         await db.query('UPDATE usuarios SET nombre = ? WHERE id_usuario = ?', [nuevoNombre, id]);
//     }

//     // Eliminar cuenta
//     static async eliminar(id) {
//         await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
//     }

//     // Verificar contraseña (para login)
//     static async verificarContrasena(email, contrasena) {
//         const usuario = await this.obtenerPorEmail(email);
//         if (!usuario) return false;
//         return bcrypt.compare(contrasena, usuario.contrasena);
//     }
// }

// module.exports = Usuario;