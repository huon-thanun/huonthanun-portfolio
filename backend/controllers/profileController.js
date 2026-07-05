const pool = require('../config/db');

// GET /api/profile  (public)
exports.get = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

// PUT /api/profile  (protected)
exports.update = async (req, res) => {
  try {
    const {
      full_name, title, tagline, about_text, email, phone, location,
      avatar_url, resume_url, github_url, linkedin_url, facebook_url
    } = req.body;

    const [rows] = await pool.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');

    if (rows[0]) {
      await pool.query(
        `UPDATE profile SET full_name=?, title=?, tagline=?, about_text=?, email=?, phone=?, location=?,
         avatar_url=?, resume_url=?, github_url=?, linkedin_url=?, facebook_url=? WHERE id=?`,
        [full_name, title, tagline, about_text, email, phone, location, avatar_url, resume_url, github_url, linkedin_url, facebook_url, rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO profile (full_name, title, tagline, about_text, email, phone, location, avatar_url, resume_url, github_url, linkedin_url, facebook_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, title, tagline, about_text, email, phone, location, avatar_url, resume_url, github_url, linkedin_url, facebook_url]
      );
    }

    const [updated] = await pool.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// GET /api/dashboard/stats  (protected - summary counts for dashboard home)
exports.getStats = async (req, res) => {
  try {
    const [[projects]] = await pool.query('SELECT COUNT(*) AS count FROM projects');
    const [[skills]] = await pool.query('SELECT COUNT(*) AS count FROM skills');
    const [[experience]] = await pool.query('SELECT COUNT(*) AS count FROM experience');
    const [[education]] = await pool.query('SELECT COUNT(*) AS count FROM education');
    const [[messages]] = await pool.query('SELECT COUNT(*) AS count FROM messages');
    const [[unreadMessages]] = await pool.query('SELECT COUNT(*) AS count FROM messages WHERE is_read = 0');

    res.json({
      projects: projects.count,
      skills: skills.count,
      experience: experience.count,
      education: education.count,
      messages: messages.count,
      unreadMessages: unreadMessages.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};
