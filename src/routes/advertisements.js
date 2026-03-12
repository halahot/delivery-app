const express = require('express');

const advertisementsController = require('../controllers/advertisementsController');

const router = express.Router();

router.get('/', advertisementsController.getList);
router.get('/:id', advertisementsController.getById);

module.exports = router;
