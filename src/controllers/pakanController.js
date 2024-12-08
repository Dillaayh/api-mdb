import db from '../models/db.js';

// Menambahkan data pakan
export const createPakan = (req, res) => {
  const { idUser, Jenis_pakan, Jumlah, Stok } = req.body;

  if (!idUser || !Jenis_pakan || !Jumlah || !Stok) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  db.query('CALL InsertPakan(?, ?, ?, ?)', [idUser, Jenis_pakan, Jumlah, Stok], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Data pakan berhasil ditambahkan' });
  });
};

// Mendapatkan data pakan berdasarkan ID
export const getPakanById = (req, res) => {
  const { idPakan } = req.params;

  db.query('CALL GetPakanById(?)', [idPakan], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results[0].length) return res.status(404).json({ message: 'Data pakan tidak ditemukan' });
    res.status(200).json(results[0]);
  });
};

// Memperbarui data pakan berdasarkan ID
export const updatePakan = (req, res) => {
  const { idPakan } = req.params;
  const { idUser, Jenis_pakan, Jumlah, Stok } = req.body;

  if (!idUser || !Jenis_pakan || !Jumlah || !Stok) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  db.query('CALL UpdatePakan(?, ?, ?, ?, ?)', [idPakan, idUser, Jenis_pakan, Jumlah, Stok], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Data pakan berhasil diupdate' });
  });
};

// Menghapus data pakan berdasarkan ID
export const deletePakan = (req, res) => {
  const { idPakan } = req.params;

  db.query('CALL DeletePakan(?)', [idPakan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Data pakan berhasil dihapus' });
  });
};
