const db = require('../config/db');

const Kesehatan = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM Kesehatan');
    return rows;
  },
  create: async (data) => {
    const { idHewan, idUser, Tanggal_pemeriksaan, Hasil_pemeriksaan, pengobatan } = data;
    await db.query('CALL InsertKesehatan(?, ?, ?, ?, ?)', [idHewan, idUser, Tanggal_pemeriksaan, Hasil_pemeriksaan, pengobatan]);
  }
};

module.exports = Kesehatan;
