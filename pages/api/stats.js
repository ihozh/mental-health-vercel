import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

function parseCsvFile(filePath, isComment = false) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map(row => {
    const created = row.Created || row.created || row.created_utc;
    return {
      created,
      // For posts, row.Title; for comments, row.ParentTitle
    };
  });
}

function getHourlyCounts(records) {
  const counts = {};
  records.forEach(rec => {
    let date = new Date(rec.created);
    if (isNaN(date.getTime())) {
      // Try parsing as string (e.g. 'Fri Jun 07 10:00:00 2024')
      date = new Date(Date.parse(rec.created));
    }
    if (!isNaN(date.getTime())) {
      const hour = date.toISOString().slice(0, 13) + ':00';
      counts[hour] = (counts[hour] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([hour, count]) => ({ hour, count })).sort((a, b) => a.hour.localeCompare(b.hour));
}

export default function handler(req, res) {
  const root = process.cwd();
  // Posts: any .csv in root except those in /comments
  const postFiles = fs.readdirSync(root).filter(f => f.endsWith('.csv') && f !== 'package-lock.csv' && f !== 'package.csv' && !f.startsWith('comments'));
  let posts = [];
  postFiles.forEach(file => {
    posts = posts.concat(parseCsvFile(path.join(root, file)));
  });

  // Comments: all csvs in /comments
  const commentsDir = path.join(root, 'comments');
  let comments = [];
  if (fs.existsSync(commentsDir)) {
    const commentFiles = fs.readdirSync(commentsDir).filter(f => f.endsWith('.csv'));
    commentFiles.forEach(file => {
      comments = comments.concat(parseCsvFile(path.join(commentsDir, file), true));
    });
  }

  // Project start: earliest post or comment
  const allCreated = posts.concat(comments).map(r => new Date(r.created)).filter(d => !isNaN(d.getTime()));
  const projectStart = allCreated.length ? new Date(Math.min(...allCreated)).toString() : 'N/A';
  const now = new Date().toString();

  res.status(200).json({
    projectStart,
    now,
    postsPerHour: getHourlyCounts(posts),
    commentsPerHour: getHourlyCounts(comments),
  });
}
