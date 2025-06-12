import pool from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { labels, username } = req.body;
  if (!Array.isArray(labels) || !username) return res.status(400).json({ error: 'Missing data' });
  try {
    for (const label of labels) {
      await pool.query(
        `INSERT INTO post_labels (post_hash, box1, box2, username)
         VALUES ($1, $2, $3, $4)`,
        [label.hash, label.box1, label.box2, username]
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
