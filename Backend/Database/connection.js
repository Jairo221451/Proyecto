const mysql = require('mysql2/promise');
//const connection = mysql.createPool({
//  host: '127.0.0.1',        // IP del servidor de base de datos
//  port: 3308,               // 👈 PUERTO ACTUALIZADO
//  user: 'root',             // Usuario de MySQL
//  password: 'Xingyue@1',    // Contraseña
//  database: 'bd_ventas',    // 👈 NOMBRE DE BASE DE DATOS ACTUALIZADO
//  waitForConnections: true,
//  connectionLimit: 10,      // Número máximo de conexiones simultáneas
//});
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'TochielVroXd12',
  database: 'bd_ds',
  waitForConnections: true,
  connectionLimit: 10,
});
module.exports = connection;