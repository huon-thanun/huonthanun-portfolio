const express = require('express');
const router = express.Router();
const controller = require('../controllers/educationController');
const authMiddleware = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.remove);

module.exports = router;
