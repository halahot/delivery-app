const express = require('express');

const rootController = require('../controllers/rootController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/health', rootController.healthCheck);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;


