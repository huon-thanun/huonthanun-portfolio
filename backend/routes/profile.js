const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

router.get('/', controller.get);
router.put('/', authMiddleware, controller.update);

module.exports = router;
