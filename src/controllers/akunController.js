import db from '../models/db.js';
import bcrypt from 'bcryptjs';

// Menambahkan data baru ke tabel Akun
export const createAkun = (req, res) => {
  const { Nama, username, Password, is_dokter } = req.body;

  if (!Nama || !username || !Password || typeof is_dokter !== 'boolean') {
    return res.status(400).json({ message: 'Semua data harus diisi dengan benar' });
  }

  const hashedPassword = bcrypt.hashSync(Password, 10);

  db.query('CALL InsertAkun(?, ?, ?, ?)', [Nama, username, hashedPassword, is_dokter], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Akun berhasil ditambahkan' });
  });  
};

// Memperbarui data akun berdasarkan ID
export const updateAkun = (req, res) => {
  const { idUser } = req.params;
  const { Nama, username, Password, is_dokter } = req.body;

  if (!Nama || !username || !Password || typeof is_dokter !== 'boolean') {
    return res.status(400).json({ message: 'Semua data harus diisi dengan benar' });
  }

  const hashedPassword = bcrypt.hashSync(Password, 10);

  db.query('CALL UpdateAkun(?, ?, ?, ?, ?)', [idUser, Nama, username, hashedPassword, is_dokter], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Akun berhasil diupdate' });
  });
};

// Mendapatkan data akun berdasarkan ID atau Nama
export const getAkunByIdAndName = (req, res) => {
  const { idUser } = req.params;
  const { Nama } = req.query;

  db.query('CALL GetAkunByIdAndName(?, ?)', [idUser || null, Nama || null], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results[0].length) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    res.status(200).json(results[0]);
  });
};

// Mendapatkan semua data dari tabel Akun
export const getAllAkun = (req, res) => {
  db.query('CALL GetAkun()', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

// Menghapus akun berdasarkan ID
export const deleteAkun = (req, res) => {
  const { idUser } = req.params;

  db.query('CALL DeleteAkun(?)', [idUser], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Akun berhasil dihapus' });
  });
};

// Fungsi untuk mencari akun berdasarkan nama
export const searchAkunByName = (req, res) => {
  const { nama } = req.query;

  if (!nama) {
      return res.status(400).json({ message: 'Parameter nama harus diberikan' });
  }

  // Panggil stored procedure
  db.query('CALL SearchAkunByName(?)', [nama], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      res.status(200).json(results[0]);
  });
};
