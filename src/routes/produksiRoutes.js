import express from 'express';
import { createProduksi, getProduksiById, updateProduksi, deleteProduksi } from '../controllers/produksiController.js';

const router = express.Router();

// Route untuk menambahkan data produksi
router.post('/', createProduksi);

// Route untuk mendapatkan data produksi berdasarkan ID
router.get('/:idProduksi', getProduksiById);

// Route untuk memperbarui data produksi berdasarkan ID
router.put('/:idProduksi', updateProduksi);

// Route untuk menghapus data produksi berdasarkan ID
router.delete('/:idProduksi', deleteProduksi);

export default router;
