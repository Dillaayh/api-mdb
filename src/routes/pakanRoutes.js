import express from 'express';
import { createPakan, getPakanById, updatePakan, deletePakan, searchPakanByName, getTotalStokPakan } from '../controllers/pakanController.js';

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

// Define the endpoint
router.get('/total-stok-pakan', getTotalStokPakan);

export default router;
