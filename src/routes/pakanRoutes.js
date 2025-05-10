import express from 'express';
import { createPakan, getPakanById, updatePakan, deletePakan, searchPakanByName, getPakanStok, hitungTotalStokPakan } from '../controllers/pakanController.js';

const router = express.Router();

// Route untuk menambahkan data pakan
router.post('/', createPakan);

// Route untuk mendapatkan data pakan berdasarkan ID
router.get('/:idPakan', getPakanById);

// Route untuk memperbarui data pakan berdasarkan ID
router.put('/:idPakan', updatePakan);

// Route untuk menghapus data pakan berdasarkan ID
router.delete('/:idPakan', deletePakan);

// Route untuk mencari pakan berdasarkan jenis pakan
router.get('/search', searchPakanByName);

// Route untuk mengambil data stok pakan berdasarkan ID pengguna
router.get('/:p_idPakan', getPakanStok);

// Menambahkan route untuk menghitung total stok pakan
router.post('/hitung-total-stok-pakan', hitungTotalStokPakan);

export default router;
