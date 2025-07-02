const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3308,
      user: 'root',
      password: 'Xingyue@1',
      database: 'bd_ventas',
    });
    console.log("✅ Conexión exitosa");
    const [rows] = await conn.query("SELECT NOW()");
    console.log(rows);
    conn.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testConnection();
