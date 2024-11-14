const Hewan = require('../models/hewanModel');

exports.getHewan = async (req, res) => {
  try {
    const data = await Hewan.getAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHewanById = async (req, res) => {
  try {
    const data = await Hewan.getById(req.params.idHewan);
    if (!data) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHewan = async (req, res) => {
  try {
    await Hewan.create(req.body);
    res.status(201).json({ message: 'Hewan berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHewan = async (req, res) => {
  try {
    await Hewan.delete(req.params.idHewan);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
