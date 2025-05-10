import express from 'express';
import { getHewan, addHewan, updateHewan, deleteHewan,  searchHewanByName, getJumlahHewanByStatusKesehatan } from '../controllers/hewanController.js';

const router = express.Router();

// Route untuk mendapatkan semua hewan
router.get('/', getHewan);

// Route untuk menambahkan hewan baru
router.post('/', addHewan);

// Route untuk memperbarui data hewan
router.put('/', updateHewan);

// Route untuk menghapus hewan berdasarkan ID
router.delete('/:idHewan', deleteHewan);

// Route untuk mencari hewan berdasarkan spesies
router.get('/search', searchHewanByName);

// Route untuk mendapatkan jumlah hewan berdasarkan status kesehatan
router.post("/jumlah-hewan", getJumlahHewanByStatusKesehatan);

export default router;
