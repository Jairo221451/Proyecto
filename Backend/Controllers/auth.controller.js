const Usuario = require('../Models/Usuario');
const jwt = require('jsonwebtoken');

// Registro con confirmación de contraseña
const register = async (req, res) => {
    try {
        const { nombre, email, contrasena, confirmarContrasena } = req.body;

        // Validaciones
        if (!nombre || !email || !contrasena || !confirmarContrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const usuarioExistente = await Usuario.obtenerPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        await Usuario.crear(nombre, email, contrasena);
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login seguro
const login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const usuario = await Usuario.obtenerPorEmail(email);

        if (!usuario || !(await Usuario.verificarContrasena(email, contrasena))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, esAdmin: usuario.es_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                esAdmin: usuario.es_admin
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar nombre de usuario
const actualizarNombre = async (req, res) => {
    try {
        const { nuevoNombre } = req.body;
        await Usuario.actualizarNombre(req.user.id, nuevoNombre);
        res.json({ mensaje: 'Nombre actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cuenta
const eliminarCuenta = async (req, res) => {
    try {
        await Usuario.eliminar(req.user.id);
        res.json({ mensaje: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar configuracion
const actualizarConfiguracion = async (req, res) => {
  try {
    const { nombre, correo, contrasena_actual, nueva_contrasena } = req.body;

    const usuario = await Usuario.obtenerPorId(req.user.id);

    // Validar que el usuario exista
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual si se quiere cambiar la contraseña
    if (nueva_contrasena) {
      const esValida = await Usuario.verificarContrasena(usuario.email, contrasena_actual);
      if (!esValida) {
        return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      }
    }

    // Actualizar datos
    await Usuario.actualizarConfiguracion(req.user.id, {
      nombre,
      correo,
      nueva_contrasena
    });

    res.json({ mensaje: 'Configuración actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login, actualizarNombre, eliminarCuenta };

module.exports = { register, login, actualizarNombre, eliminarCuenta, actualizarConfiguracion };

// const Usuario = require('../Models/Usuario');
// const jwt = require('jsonwebtoken');

// // Registro con confirmación de contraseña
// const register = async (req, res) => {
//     try {
//         const { nombre, email, contrasena, confirmarContrasena } = req.body;

//         // Validaciones
//         if (!nombre || !email || !contrasena || !confirmarContrasena) {
//             return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//         }
//         if (contrasena !== confirmarContrasena) {
//             return res.status(400).json({ error: 'Las contraseñas no coinciden' });
//         }

//         const usuarioExistente = await Usuario.obtenerPorEmail(email);
//         if (usuarioExistente) {
//             return res.status(400).json({ error: 'El email ya está registrado' });
//         }

//         await Usuario.crear(nombre, email, contrasena);
//         res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Login seguro
// const login = async (req, res) => {
//     try {
//         const { email, contrasena } = req.body;
//         const usuario = await Usuario.obtenerPorEmail(email);

//         if (!usuario || !(await Usuario.verificarContrasena(email, contrasena))) {
//             return res.status(401).json({ error: 'Credenciales inválidas' });
//         }

//         const token = jwt.sign(
//             { id: usuario.id_usuario, esAdmin: usuario.es_admin },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.json({ 
//             token,
//             usuario: {
//                 id: usuario.id_usuario,
//                 nombre: usuario.nombre,
//                 esAdmin: usuario.es_admin
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Actualizar nombre de usuario
// const actualizarNombre = async (req, res) => {
//     try {
//         const { nuevoNombre } = req.body;
//         await Usuario.actualizarNombre(req.user.id, nuevoNombre);
//         res.json({ mensaje: 'Nombre actualizado exitosamente' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Eliminar cuenta
// const eliminarCuenta = async (req, res) => {
//     try {
//         await Usuario.eliminar(req.user.id);
//         res.json({ mensaje: 'Cuenta eliminada exitosamente' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = { register, login, actualizarNombre, eliminarCuenta };