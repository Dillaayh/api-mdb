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

export const searchProduksiByName = (req, res) => {
  const { jenis_produksi } = req.query;

  if (!jenis_produksi) {
    return res.status(400).json({ message: 'Parameter jenis_produksi harus diberikan' });
  }

  db.query('CALL SearchProduksiByName(?)', [jenis_produksi], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

export const getJenisProduksiByHewan = (req, res) => {
  const { idHewan } = req.body;  // Ambil ID Hewan dari request body

  // Pastikan idHewan ada dalam request body
  if (!idHewan) {
    return res.status(400).json({
      status: "error",
      message: "ID Hewan tidak ditemukan dalam request.",
    });
  }

  // Panggil prosedur get_jenis_produksi_by_hewan dengan idHewan sebagai parameter
  db.query("CALL get_jenis_produksi_by_hewan(?, @jenisProduksi);", [idHewan], (err, results) => {
    if (err) {
      console.error("Error menjalankan prosedur:", err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
      });
    }

    // Ambil hasil output dari prosedur
    db.query("SELECT @jenisProduksi AS jenisProduksi;", (err, result) => {
      if (err) {
        console.error("Error mengambil hasil output:", err);
        return res.status(500).json({
          status: "error",
          message: "Terjadi kesalahan pada server",
        });
      }

      if (result.length > 0) {
        res.json({
          status: "success",
          jenisProduksi: result[0].jenisProduksi,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Jenis produksi tidak ditemukan untuk ID Hewan tersebut",
        });
      }
    });
  });
};


export const hitungTotalProduksi = (req, res) => {
  const { jenisProduksi } = req.body;  // Mengambil data jenis produksi dari request body
  console.log('Jenis Produksi yang dikirim:', jenisProduksi);  // Debug log

  // Memanggil prosedur untuk menghitung total produksi
  db.query('CALL hitung_total_produksi(?, @totalProduksi);', [jenisProduksi], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menjalankan prosedur',
      });
    }

    // Mengambil hasil dari variabel output @totalProduksi
    db.query('SELECT @totalProduksi AS totalProduksi', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan saat mengambil hasil produksi',
        });
      }

      console.log('Result dari query:', result);  // Debug log

      if (result.length === 0 || result[0].totalProduksi === null) {
        return res.status(404).json({
          status: 'error',
          message: 'Total produksi tidak ditemukan',
        });
      }

      res.json({
        status: 'success',
        totalProduksi: result[0].totalProduksi,
      });
    });
  });
};

// Fungsi untuk mengambil semua data produksi hewan
export const ambilDataProduksiHewan = (req, res) => {
  const query = 'CALL ambil_data_produksi_hewan()';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error executing query', error: err });
    }

    // Mengembalikan hasil query ke client
    res.status(200).json({
      message: 'Data retrieved successfully',
      data: results[0] // Mengambil hasil dari SELECT query
    });
  });
};
