const db = require('../config/db');

const Akun = {
  getAll: async () => {
    const [rows] = await db.query('CALL GetAkun()');
    return rows[0];
  },
  
  getById: async (idUser) => {
    const [rows] = await db.query('CALL GetAkunByIdAndName(?, NULL)', [idUser]);
    return rows[0];
  },

  create: async (data) => {
    const { Nama, Email, Password, idRole } = data;
    const [result] = await db.query('CALL InsertAkun(?, ?, ?, ?)', [Nama, Email, Password, idRole]);
    return result;
  },

  delete: async (idUser) => {
    await db.query('CALL DeleteAkun(?)', [idUser]);
  }
};

module.exports = Akun;
