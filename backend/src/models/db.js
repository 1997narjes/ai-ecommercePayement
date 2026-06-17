// db.js — Connexion à MariaDB/MySQL
// Ce fichier crée un pool de connexions réutilisables
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',           // Vide par défaut dans XAMPP
  database: 'ai_ecommerce',
  waitForConnections: true,
  connectionLimit: 10     // Max 10 connexions simultanées
});

module.exports = pool;