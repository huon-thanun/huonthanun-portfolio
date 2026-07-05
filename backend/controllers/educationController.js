const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM education ORDER BY display_order ASC, start_date DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch education.' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM education WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Education entry not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch education entry.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { school, degree, field_of_study, start_date, end_date, description, display_order } = req.body;
    if (!school) return res.status(400).json({ message: 'School is required.' });

    const [result] = await pool.query(
      `INSERT INTO education (school, degree, field_of_study, start_date, end_date, description, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [school, degree || null, field_of_study || null, start_date || null, end_date || null, description || null, display_order || 0]
    );
    const [rows] = await pool.query('SELECT * FROM education WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create education entry.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { school, degree, field_of_study, start_date, end_date, description, display_order } = req.body;
    const [existing] = await pool.query('SELECT * FROM education WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Education entry not found.' });

    await pool.query(
      `UPDATE education SET school=?, degree=?, field_of_study=?, start_date=?, end_date=?, description=?, display_order=?
       WHERE id=?`,
      [school, degree, field_of_study, start_date, end_date, description, display_order || 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM education WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update education entry.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM education WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Education entry not found.' });
    await pool.query('DELETE FROM education WHERE id = ?', [req.params.id]);
    res.json({ message: 'Education entry deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete education entry.' });
  }
};
