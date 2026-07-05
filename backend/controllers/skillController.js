const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY display_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch skills.' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Skill not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch skill.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, proficiency, icon_class, display_order } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });

    const [result] = await pool.query(
      `INSERT INTO skills (name, category, proficiency, icon_class, display_order) VALUES (?, ?, ?, ?, ?)`,
      [name, category || 'General', proficiency || 50, icon_class || null, display_order || 0]
    );
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create skill.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, category, proficiency, icon_class, display_order } = req.body;
    const [existing] = await pool.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Skill not found.' });

    await pool.query(
      `UPDATE skills SET name=?, category=?, proficiency=?, icon_class=?, display_order=? WHERE id=?`,
      [name, category, proficiency, icon_class, display_order || 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update skill.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Skill not found.' });
    await pool.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ message: 'Skill deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete skill.' });
  }
};
