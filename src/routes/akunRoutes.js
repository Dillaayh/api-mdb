import express from 'express';
import {
  createAkun,
  updateAkun,
  getAkunByIdAndName,
  getAllAkun,
  deleteAkun,
  searchAkunByName
} from '../controllers/akunController.js';

const router = express.Router();

// Route untuk menambahkan data akun
router.post('/', createAkun);

// Route untuk memperbarui data akun berdasarkan ID
router.put('/:idUser', updateAkun);

// Route untuk mendapatkan akun berdasarkan ID atau Nama
router.get('/search-id-nama?', getAkunByIdAndName);

// Route untuk mendapatkan semua data akun
router.get('/', getAllAkun);

// Route untuk menghapus akun berdasarkan ID
router.delete('/:idUser', deleteAkun);

// Route untuk mencari akun berdasarkan nama
router.get('/search-akun', searchAkunByName);

export default router;
