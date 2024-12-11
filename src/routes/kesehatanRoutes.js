import express from 'express';
import { createKesehatan, getKesehatanById, deleteKesehatan, getRiwayatKesehatan,  searchKesehatanByName } from '../controllers/kesehatanController.js';

const router = express.Router();

// Route untuk menambahkan catatan kesehatan
router.post('/', createKesehatan);

// Route untuk mendapatkan catatan kesehatan berdasarkan ID
router.get('/:idKesehatan', getKesehatanById);

// Route untuk menghapus catatan kesehatan berdasarkan ID
router.delete('/:idKesehatan', deleteKesehatan);

// Route untuk melihat riwayat kesehatan berdasarkan ID Hewan
router.get('/riwayat/:idHewan', getRiwayatKesehatan);

// Route untuk mencari kesehatan berdasarkan hasil pemeriksaan
router.get('/search', searchKesehatanByName);

export default router;
