const express = require('express');

const advertisementsController = require('../controllers/advertisementsController');
const requireAuth = require('../middlewares/requireAuth');
const { uploadImages } = require('../middlewares/upload');

const router = express.Router();

router.get('/', advertisementsController.getList);
router.get('/:id', advertisementsController.getById);
router.post('/', requireAuth, uploadImages, advertisementsController.create);
router.delete('/:id', requireAuth, advertisementsController.remove);

module.exports = router;
