import express from 'express';
import {
  createAkun,
  updateAkun,
  getAkunByIdAndName,
  getAllAkun,
  deleteAkun,
} from '../controllers/akunController.js';

const router = express.Router();

// Route untuk menambahkan data akun
router.post('/', createAkun);

// Route untuk memperbarui data akun berdasarkan ID
router.put('/:idUser', updateAkun);

// Route untuk mendapatkan akun berdasarkan ID atau Nama
router.get('/:idUser?', getAkunByIdAndName);

// Route untuk mendapatkan semua data akun
router.get('/', getAllAkun);

// Route untuk menghapus akun berdasarkan ID
router.delete('/:idUser', deleteAkun);

export default router;
