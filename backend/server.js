const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

async function ensureImageColumns() {
  await pool.query('ALTER TABLE profile MODIFY avatar_url LONGTEXT NULL');
  await pool.query('ALTER TABLE projects MODIFY image_url LONGTEXT NULL');
}

// ---------- Middleware ----------
app.use(cors()); // allow requests from the Vue frontend (any origin, for dev simplicity)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler (e.g. multer file errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5050;

ensureImageColumns()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Portfolio API server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to prepare database schema for image uploads.', err);
    process.exit(1);
  });
