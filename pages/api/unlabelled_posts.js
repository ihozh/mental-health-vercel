import pool from './db';

export default async function handler(req, res) {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Query to get posts that haven't been labeled by this user
    const result = await pool.query(`
      SELECT p.id, p.title, p.body, p.created, p.post_hash
      FROM posts p
      WHERE NOT EXISTS (
        SELECT 1 FROM post_labels pl
        WHERE pl.post_hash = p.post_hash AND pl.username = $1
      )
      ORDER BY RANDOM()
      LIMIT 30
    `, [username]);
    
    res.status(200).json({ posts: result.rows });
  } catch (err) {
    console.error('Error fetching unlabelled posts:', err);
    res.status(500).json({ error: err.message });
  }
}
