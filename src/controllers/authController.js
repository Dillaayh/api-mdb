import jwt from 'jsonwebtoken';
import db from '../models/db.js';  // Pastikan path ke file db.js sudah benar

const JWT_SECRET = process.env.JWT_SECRET;  // Pastikan JWT_SECRET ada di environment variables Anda

// Fungsi untuk login
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Pastikan input valid
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  console.log("Login data:", { username, password });

  db.query(
    'CALL login(?, ?)', 
    [username, password], 
    (err, results) => {
      if (err) {
        console.error('Error saat login:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat login' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Username atau password salah' });
      }

      return res.status(200).json({ message: 'Login berhasil' });
    }
  );
};
