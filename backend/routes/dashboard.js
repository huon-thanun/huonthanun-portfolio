const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, controller.getStats);

module.exports = router;
