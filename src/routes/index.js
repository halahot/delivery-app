const express = require('express');

const rootController = require('../controllers/rootController');

const router = express.Router();

router.get('/health', rootController.healthCheck);

module.exports = router;

