const db = require('./Database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createAdmin() {
    const nombre = 'Heidan Toribio';
    const email = 'heidan.toribio@gmail.com';
    const contrasena = 'TochielVroXd12'; // Cambia esto
    
    try {
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
        
        // Insertar en la base de datos
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, contrasena, es_admin) VALUES (?, ?, ?, TRUE)',
            [nombre, email, hashedPassword]
        );
        
        console.log('✅ Administrador creado con ID:', result.insertId);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAdmin();