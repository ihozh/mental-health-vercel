import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const statsPath = path.join(process.cwd(), 'stats.json');
  if (!fs.existsSync(statsPath)) {
    return res.status(404).json({ error: 'stats.json not found' });
  }
  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  res.status(200).json(stats);
}
