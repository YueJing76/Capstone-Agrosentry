const { Pool } = require("pg"); // Gunakan Pool dari 'pg'
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Penting untuk koneksi aman ke Supabase
  },
});

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to PostgreSQL database:", err.message);
    return;
  }
  console.log("Connected to PostgreSQL database successfully!");
  client.release(); // Lepaskan klien kembali ke pool
});

// Sediakan cara untuk mengeksekusi kueri
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(), // Untuk transaksi atau beberapa kueri dengan satu klien
};