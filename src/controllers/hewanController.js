import db from '../models/db.js';

// Controller untuk mendapatkan semua data hewan
export const getHewan = (req, res) => {
  db.query('CALL GetHewan()', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

// Controller untuk menambahkan hewan baru
export const addHewan = (req, res) => {
  const { Umur, Spesies, Status_kesehatan } = req.body;
  db.query('CALL InsertHewan(?, ?, ?)', [Umur, Spesies, Status_kesehatan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Hewan berhasil ditambahkan' });
  });
};

// Controller untuk memperbarui data hewan
export const updateHewan = (req, res) => {
  const { idHewan, Umur, Spesies, Status_kesehatan } = req.body;
  db.query('CALL UpdateHewan(?, ?, ?, ?)', [idHewan, Umur, Spesies, Status_kesehatan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Hewan berhasil diperbarui' });
  });
};

// Controller untuk menghapus hewan berdasarkan ID
export const deleteHewan = (req, res) => {
  const { idHewan } = req.params;
  db.query('CALL DeleteHewan(?)', [idHewan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Hewan berhasil dihapus' });
  });
};
