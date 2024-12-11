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

export const searchPakanByName = (req, res) => {
  const { jenis_pakan } = req.query;

  if (!jenis_pakan) {
    return res.status(400).json({ message: 'Parameter jenis_pakan harus diberikan' });
  }

  db.query('CALL SearchPakanByName(?)', [jenis_pakan], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

// Controller to call stored procedure `ambil_total_stok_pakan`
export const getTotalStokPakan = (req, res) => {
  // Define the OUT parameter to store the result
  let totalStok = 0;

  // Call the stored procedure
  db.query('CALL ambil_total_stok_pakan(?)', [totalStok], (err, results) => {
      if (err) {
          console.error('Error calling stored procedure:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      // Extract the total stok value from the result
      const result = results[0][0]; // Assuming the result is in the first index
      totalStok = result.totalStok;

      return res.status(200).json({
          message: 'Berhasil mengambil total stok pakan',
          totalStok: totalStok
      });
  });
};
