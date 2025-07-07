import pool from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { labels, username } = req.body;
  if (!Array.isArray(labels) || !username) return res.status(400).json({ error: 'Missing data' });
  
  try {
    // First, check if the timestamp column exists in the post_labels table
    try {
      await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'post_labels' AND column_name = 'timestamp'
      `);
    } catch (err) {
      // If there's an error or the column doesn't exist, add it
      console.log('Adding timestamp column to post_labels table');
      await pool.query(`
        ALTER TABLE post_labels 
        ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE
      `);
    }
    
    // Get current timestamp
    const now = new Date();
    
    for (const label of labels) {
      await pool.query(
        `INSERT INTO post_labels (post_hash, box1, box2, username, timestamp)
         VALUES ($1, $2, $3, $4, $5)`,
        [label.hash, label.box1, label.box2, username, now]
      );
    }
    
    res.status(200).json({ 
      success: true, 
      timestamp: now.toISOString(),
      message: 'Labels submitted with timestamp'
    });
  } catch (err) {
    console.error('Error submitting labels:', err);
    res.status(500).json({ error: err.message });
  }
}
