// db.js — Connexion à MariaDB/MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ai_ecommerce',
  waitForConnections: true,
  connectionLimit: 10
});

// Test de connexion au démarrage
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected!');
    conn.release();
  })
  .catch(err => console.error('❌ DB Error:', err));

module.exports = pool;