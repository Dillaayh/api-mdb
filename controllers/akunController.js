const Akun = require('../models/akunModel');

exports.getAkun = async (req, res) => {
  try {
    const data = await Akun.getAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAkunById = async (req, res) => {
  try {
    const data = await Akun.getById(req.params.idUser);
    if (!data) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAkun = async (req, res) => {
  try {
    const data = await Akun.create(req.body);
    res.status(201).json({ message: 'Akun berhasil dibuat', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAkun = async (req, res) => {
  try {
    await Akun.delete(req.params.idUser);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
