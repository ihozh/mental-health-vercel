import pool from './db';

export default async function handler(req, res) {
  try {
    const postsResult = await pool.query('SELECT hour, count FROM posts_per_hour ORDER BY hour ASC');
    const commentsResult = await pool.query('SELECT hour, count FROM comments_per_hour ORDER BY hour ASC');
    res.status(200).json({
      postsPerHour: postsResult.rows,
      commentsPerHour: commentsResult.rows,
      now: new Date().toISOString(),
    });
  } catch (err) {
    console.error('API /api/stats error:', err);
    res.status(500).json({ error: err.message, details: err });
  }
}
