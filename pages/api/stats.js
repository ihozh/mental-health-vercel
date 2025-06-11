import pool from './db';

let cache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in ms

export default async function handler(req, res) {
  const now = Date.now();

  // Serve from cache if not expired
  if (cache && (now - cacheTimestamp < CACHE_DURATION)) {
    return res.status(200).json(cache);
  }

  try {
    const postsResult = await pool.query('SELECT hour, count FROM posts_per_hour ORDER BY hour ASC');
    const commentsResult = await pool.query('SELECT hour, count FROM comments_per_hour ORDER BY hour ASC');
    const data = {
      postsPerHour: postsResult.rows,
      commentsPerHour: commentsResult.rows,
      now: new Date().toISOString(),
    };
    cache = data;
    cacheTimestamp = now;
    res.status(200).json(data);
  } catch (err) {
    console.error('API /api/stats error:', err);
    res.status(500).json({ error: err.message, details: err });
  }
}

