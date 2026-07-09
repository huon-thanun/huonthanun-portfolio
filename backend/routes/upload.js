const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// POST /api/upload  (protected) - returns the public URL of the uploaded image
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const mimeType = req.file.mimetype || 'image/png';
  const dataUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
  res.json({ url: dataUrl });
});

module.exports = router;
