const express = require('express');
const router = express.Router();
const hewanController = require('../controllers/hewanController');

router.get('/', hewanController.getHewan);
router.get('/:idHewan', hewanController.getHewanById);
router.post('/', hewanController.createHewan);
router.delete('/:idHewan', hewanController.deleteHewan);

module.exports = router;
