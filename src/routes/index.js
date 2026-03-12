const express = require('express');

const rootController = require('../controllers/rootController');
const authController = require('../controllers/authController');
const advertisementsRoutes = require('./advertisements');

const router = express.Router();

router.get('/health', rootController.healthCheck);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.use('/advertisements', advertisementsRoutes);

module.exports = router;


