import express from 'express';
import { getHewan, addHewan, updateHewan, deleteHewan } from '../controllers/hewanController.js';

const router = express.Router();

// Route untuk mendapatkan semua hewan
router.get('/', getHewan);

// Route untuk menambahkan hewan baru
router.post('/', addHewan);

// Route untuk memperbarui data hewan
router.put('/', updateHewan);

// Route untuk menghapus hewan berdasarkan ID
router.delete('/:idHewan', deleteHewan);

export default router;
