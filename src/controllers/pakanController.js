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

// Controller untuk menghitung total stok pakan
export const hitungTotalStokPakan = (req, res) => {
  // Menjalankan prosedur HitungTotalStokPakan
  db.query('CALL HitungTotalStokPakan(@totalStok);', (err) => {
    if (err) {
      console.error('Error saat menjalankan prosedur:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menjalankan prosedur HitungTotalStokPakan',
      });
    }

    // Mengambil hasil dari variabel output @totalStok
    db.query('SELECT @totalStok AS totalStok', (err, result) => {
      if (err) {
        console.error('Error saat mengambil hasil total stok:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan saat mengambil hasil total stok',
        });
      }

      // Mengecek apakah hasilnya valid
      if (result.length === 0 || result[0].totalStok === null) {
        return res.status(404).json({
          status: 'error',
          message: 'Total stok pakan tidak ditemukan',
        });
      }

      // Mengirimkan hasil total stok pakan ke client
      res.json({
        status: 'success',
        totalStok: result[0].totalStok,
      });
    });
  });
};

// Fungsi untuk mengambil data stok pakan berdasarkan idUser
export const getPakanStok = (req, res) => {
  const { p_idPakan } = req.params;  // Mendapatkan parameter dari URL

  // Memanggil stored procedure ambil_data_pakan_stok
  db.query('CALL ambil_data_pakan_stok(?)', [p_idPakan], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error executing query', error: err });
    }

    // Mengembalikan hasil query ke client
    res.status(200).json({
      message: 'Data stok pakan berhasil diambil',
      data: results[0],  // Hasil query pertama
    });
  });
};
