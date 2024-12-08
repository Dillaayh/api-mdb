import db from '../models/db.js';

// Menambahkan data produksi hewan
export const createProduksi = (req, res) => {
  const { idHewan, idUser, Jenis_produksi, Jumlah, Stok } = req.body;

  if (!idHewan || !idUser || !Jenis_produksi || !Jumlah || !Stok) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  db.query('CALL InsertProduksi(?, ?, ?, ?, ?)', [idHewan, idUser, Jenis_produksi, Jumlah, Stok], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Data produksi berhasil ditambahkan' });
  });
};

// Mendapatkan data produksi berdasarkan ID
export const getProduksiById = (req, res) => {
  const { idProduksi } = req.params;

  db.query('CALL GetProduksiById(?)', [idProduksi], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results[0].length) return res.status(404).json({ message: 'Data produksi tidak ditemukan' });
    res.status(200).json(results[0]);
  });
};

// Memperbarui data produksi berdasarkan ID
export const updateProduksi = (req, res) => {
  const { idProduksi } = req.params;
  const { idHewan, idUser, Jenis_produksi, Jumlah, Stok } = req.body;

  if (!idHewan || !idUser || !Jenis_produksi || !Jumlah || !Stok) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  db.query('CALL UpdateProduksi(?, ?, ?, ?, ?, ?)', [idProduksi, idHewan, idUser, Jenis_produksi, Jumlah, Stok], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Data produksi berhasil diupdate' });
  });
};

// Menghapus data produksi berdasarkan ID
export const deleteProduksi = (req, res) => {
  const { idProduksi } = req.params;

  db.query('CALL DeleteProduksi(?)', [idProduksi], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Data produksi berhasil dihapus' });
  });
};
