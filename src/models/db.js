// models/db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "dokter",
  password: "dokter123",
  database: "manajemen_peternakan",
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL Database');
});

export default db;
