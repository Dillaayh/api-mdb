import express from 'express';
import { createProduksi, getProduksiById, updateProduksi, deleteProduksi, searchProduksiByName, hitungTotalProduksi, getJenisProduksiByHewan, ambilDataProduksiHewan } from '../controllers/produksiController.js';

const router = express.Router();

// Route untuk menambahkan data produksi
router.post('/', createProduksi);

// Route untuk mendapatkan data produksi berdasarkan ID
router.get('/:idProduksi', getProduksiById);

// Route untuk memperbarui data produksi berdasarkan ID
router.put('/:idProduksi', updateProduksi);

// Route untuk menghapus data produksi berdasarkan ID
router.delete('/:idProduksi', deleteProduksi);

// Route untuk mencari produksi berdasarkan jenis produksi
router.get('/search-produksi', searchProduksiByName);

// Endpoint untuk menghitung total produksi berdasarkan jenis produksi
router.post('/total-produksi', hitungTotalProduksi);

// Endpoint untuk mendapatkan jenis produksi berdasarkan ID Hewan
router.post('/jenis-produksi', getJenisProduksiByHewan);

// Route untuk mendapatkan data produksi hewan
router.get('/produksi-hewan', ambilDataProduksiHewan);

export default router;
