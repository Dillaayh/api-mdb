const db = require('../config/db');

const Hewan = {
  getAll: async () => {
    const [rows] = await db.query('CALL GetHewan()');
    return rows[0];
  },

  getById: async (idHewan) => {
    const [rows] = await db.query('CALL sp_GetHewanByIdAndSpecies(?, NULL)', [idHewan]);
    return rows[0];
  },

  create: async (data) => {
    const { Umur, Spesies, Status_kesehatan } = data;
    await db.query('CALL InsertHewan(?, ?, ?)', [Umur, Spesies, Status_kesehatan]);
  },

  delete: async (idHewan) => {
    await db.query('CALL DeleteHewan(?)', [idHewan]);
  }
};

module.exports = Hewan;
