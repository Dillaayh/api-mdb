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

// Fungsi untuk mencari hewan berdasarkan spesies
export const searchHewanByName = (req, res) => {
  const { spesies } = req.query;

  if (!spesies) {
    return res.status(400).json({ message: 'Parameter spesies harus diberikan' });
  }

  db.query('CALL SearchHewanByName(?)', [spesies], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

// Controller untuk menghitung jumlah hewan berdasarkan status kesehatan
export const getJumlahHewanByStatusKesehatan = (req, res) => {
  const { statusKesehatan } = req.body; // Ambil parameter dari request body
  console.log('Status Kesehatan:', statusKesehatan); // Log statusKesehatan untuk memastikan nilai yang diterima

  // Panggil prosedur dengan parameter input dan output
  db.query("CALL get_jumlah_hewan_by_status_kesehatan(?, @jumlahHewan);", [statusKesehatan], (err, results) => {
    if (err) {
      console.error("Error menjalankan prosedur:", err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
      });
    }

    console.log("Results from first query:", results); // Log hasil dari query pertama

    // Ambil hasil output dari prosedur
    db.query("SELECT @jumlahHewan AS jumlahHewan;", (err, result) => {
      if (err) {
        console.error("Error mengambil hasil output:", err);
        return res.status(500).json({
          status: "error",
          message: "Terjadi kesalahan pada server",
        });
      }

      console.log("Results from second query:", result); // Log hasil dari query kedua

      if (result.length > 0) {
        res.json({
          status: "success",
          jumlahHewan: result[0].jumlahHewan,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Jumlah hewan tidak ditemukan",
        });
      }
    });
  });
};
