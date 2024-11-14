const express = require('express');
const router = express.Router();
const akunController = require('../controllers/akunController');

router.get('/', akunController.getAkun);
router.get('/:idUser', akunController.getAkunById);
router.post('/', akunController.createAkun);
router.delete('/:idUser', akunController.deleteAkun);

module.exports = router;
