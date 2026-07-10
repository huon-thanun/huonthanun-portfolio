const pool = require('../config/db');
const { sendContactNotification } = require('../utils/resendMailer');

// POST /api/messages  (public - contact form submit)
exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || null, message]
    );

    // Look up the admin's contact email dynamically from the profile table
    // (this is the email set in Dashboard → Profile) and notify them.
    const [profileRows] = await pool.query('SELECT email FROM profile ORDER BY id ASC LIMIT 1');
    const adminEmail = profileRows[0]?.email;
    sendContactNotification(adminEmail, { name, email, subject, message }); // fire-and-forget

    res.status(201).json({ message: 'Message sent successfully. Thank you for reaching out!', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

// GET /api/messages  (protected - dashboard inbox)
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

// PATCH /api/messages/:id/read  (protected)
exports.markRead = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Message not found.' });
    await pool.query('UPDATE messages SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update message.' });
  }
};

// DELETE /api/messages/:id  (protected)
exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Message not found.' });
    await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete message.' });
  }
};
