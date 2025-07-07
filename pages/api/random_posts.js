import pool from './db';

export default async function handler(req, res) {
  try {
    // Get 30 random posts from posts table
    const result = await pool.query(`
      SELECT id, title, body, created, post_hash
      FROM posts
      ORDER BY RANDOM()
      LIMIT 3
    `);
    res.status(200).json({ posts: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
