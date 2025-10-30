import pool from './db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { format = 'csv', download = 'false' } = req.query;
  const isDownload = download === 'true';

  try {
    // Get dataset statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_labeled,
        COUNT(DISTINCT username) as unique_contributors,
        MAX(timestamp) as last_updated
      FROM post_labels
    `;
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    // Get label distribution
    const box1DistQuery = `
      SELECT box1, COUNT(*) as count
      FROM post_labels
      GROUP BY box1
      ORDER BY count DESC
    `;
    const box1Result = await pool.query(box1DistQuery);
    
    const box2DistQuery = `
      SELECT box2, COUNT(*) as count
      FROM post_labels
      GROUP BY box2
      ORDER BY count DESC
    `;
    const box2Result = await pool.query(box2DistQuery);

    // If not downloading, return statistics
    if (!isDownload) {
      const labelDistribution = {
        box1: {},
        box2: {}
      };
      
      box1Result.rows.forEach(row => {
        labelDistribution.box1[row.box1] = parseInt(row.count);
      });
      
      box2Result.rows.forEach(row => {
        labelDistribution.box2[row.box2] = parseInt(row.count);
      });

      return res.status(200).json({
        totalLabeled: parseInt(stats.total_labeled),
        uniqueContributors: parseInt(stats.unique_contributors),
        lastUpdated: stats.last_updated,
        labelDistribution
      });
    }

    // If downloading, get full dataset
    const dataQuery = `
      SELECT 
        post_hash,
        box1,
        box2
      FROM post_labels
      ORDER BY timestamp DESC
    `;
    
    const dataResult = await pool.query(dataQuery);
    const data = dataResult.rows;

    if (format === 'json') {
      // Return as JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=mental_health_dataset.json');
      return res.status(200).json({
        metadata: {
          totalRecords: data.length,
          exportDate: new Date().toISOString(),
          uniqueContributors: parseInt(stats.unique_contributors)
        },
        data: data
      });
    } else {
      // Return as CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=mental_health_dataset.csv');
      
      // CSV headers
      const headers = [
        'post_hash',
        'box1',
        'box2'
      ];
      
      let csv = headers.join(',') + '\n';
      
      // CSV rows
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              value = `"${value}"`;
            }
          }
          return value;
        });
        csv += values.join(',') + '\n';
      });
      
      return res.status(200).send(csv);
    }
  } catch (err) {
    console.error('Error fetching dataset:', err);
    return res.status(500).json({ error: err.message });
  }
}
