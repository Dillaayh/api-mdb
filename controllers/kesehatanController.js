const Kesehatan = require('../models/kesehatanModel');

exports.getKesehatan = async (req, res) => {
  try {
    const data = await Kesehatan.getAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createKesehatan = async (req, res) => {
  try {
    await Kesehatan.create(req.body);
    res.status(201).json({ message: 'Data kesehatan berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
