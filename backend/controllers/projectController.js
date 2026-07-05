const pool = require('../config/db');

// GET /api/projects  (public)
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY display_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Project not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
};

// POST /api/projects  (protected)
exports.create = async (req, res) => {
  try {
    const { title, description, image_url, tech_stack, demo_url, repo_url, featured, display_order } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required.' });

    const [result] = await pool.query(
      `INSERT INTO projects (title, description, image_url, tech_stack, demo_url, repo_url, featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, image_url || null, tech_stack || null, demo_url || null, repo_url || null, featured ? 1 : 0, display_order || 0]
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project.' });
  }
};

// PUT /api/projects/:id  (protected)
exports.update = async (req, res) => {
  try {
    const { title, description, image_url, tech_stack, demo_url, repo_url, featured, display_order } = req.body;
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Project not found.' });

    await pool.query(
      `UPDATE projects SET title=?, description=?, image_url=?, tech_stack=?, demo_url=?, repo_url=?, featured=?, display_order=?
       WHERE id=?`,
      [title, description, image_url, tech_stack, demo_url, repo_url, featured ? 1 : 0, display_order || 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project.' });
  }
};

// DELETE /api/projects/:id  (protected)
exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ message: 'Project not found.' });
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project.' });
  }
};
