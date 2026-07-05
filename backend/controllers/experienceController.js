const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experience ORDER BY display_order ASC, start_date DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch experience.' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experience WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Experience entry not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch experience entry.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { company, position, description, start_date, end_date, location, display_order } = req.body;
    if (!company || !position) return res.status(400).json({ message: 'Company and position are required.' });

    const [result] = await pool.query(
      `INSERT INTO experience (company, position, description, start_date, end_date, location, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [company, position, description || null, start_date || null, end_date || null, location || null, display_order || 0]
    );
    const [rows] = await pool.query('SELECT * FROM experience WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create experience entry.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { company, position, description, start_date, end_date, location, display_order } = req.body;
    const [existing] = await pool.query('SELECT * FROM experience WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Experience entry not found.' });

    await pool.query(
      `UPDATE experience SET company=?, position=?, description=?, start_date=?, end_date=?, location=?, display_order=?
       WHERE id=?`,
      [company, position, description, start_date, end_date, location, display_order || 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM experience WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update experience entry.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM experience WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Experience entry not found.' });
    await pool.query('DELETE FROM experience WHERE id = ?', [req.params.id]);
    res.json({ message: 'Experience entry deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete experience entry.' });
  }
};
