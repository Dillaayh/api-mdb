import db from '../models/db.js';

// Menambahkan catatan kesehatan hewan
export const createKesehatan = (req, res) => {
  const { idHewan, idUser, Tanggal_pemeriksaan, Hasil_pemeriksaan, pengobatan } = req.body;

  if (!idHewan || !idUser || !Tanggal_pemeriksaan || !Hasil_pemeriksaan || !pengobatan) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  db.query('CALL InsertKesehatan(?, ?, ?, ?, ?)', [idHewan, idUser, Tanggal_pemeriksaan, Hasil_pemeriksaan, pengobatan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Catatan kesehatan berhasil ditambahkan' });
  });
};

// Mendapatkan data kesehatan berdasarkan idKesehatan
export const getKesehatanById = (req, res) => {
    const { idKesehatan } = req.params;
  
    db.query('CALL GetKesehatanById(?)', [idKesehatan], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results[0].length) return res.status(404).json({ message: 'Catatan kesehatan tidak ditemukan' });
      res.status(200).json(results[0]);
    });
  };
  

// Menghapus catatan kesehatan berdasarkan ID
export const deleteKesehatan = (req, res) => {
  const { idKesehatan } = req.params;

  db.query('CALL DeleteKesehatan(?)', [idKesehatan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Catatan kesehatan berhasil dihapus' });
  });
};

// Melihat riwayat kesehatan berdasarkan ID Hewan
export const getRiwayatKesehatan = (req, res) => {
  const { idHewan } = req.params;

  db.query('CALL LihatRiwayatKesehatan(?)', [idHewan], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results[0].length) return res.status(404).json({ message: 'Riwayat kesehatan tidak ditemukan' });
    res.status(200).json(results[0]);
  });
};

export const searchKesehatanByName = (req, res) => {
  const { hasil_pemeriksaan } = req.query;

  if (!hasil_pemeriksaan) {
    return res.status(400).json({ message: 'Parameter hasil_pemeriksaan harus diberikan' });
  }

  db.query('CALL SearchKesehatanByName(?)', [hasil_pemeriksaan], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (!results[0].length) {
      return res.status(404).json({ message: 'Hasil pemeriksaan tidak ditemukan' });
    }

    res.status(200).json(results[0]);
  });
};



