const express = require('express');
const router = express.Router();
const controller = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.post('/', controller.create);                        // public contact form
router.get('/', authMiddleware, controller.getAll);          // dashboard inbox
router.patch('/:id/read', authMiddleware, controller.markRead);
router.delete('/:id', authMiddleware, controller.remove);

module.exports = router;
