const express = require('express');
const router = express.Router();
const kesehatanController = require('../controllers/kesehatanController');

router.get('/', kesehatanController.getKesehatan);
router.post('/', kesehatanController.createKesehatan);

module.exports = router;
