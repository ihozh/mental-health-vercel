import pool from './db';

// Enhanced caching system with separate cache entries for different data types
const cache = {
  postsPerHour: null,
  commentsPerHour: null,
  labelingProgress: null
};

const cacheTimestamps = {
  postsPerHour: 0,
  commentsPerHour: 0,
  labelingProgress: 0
};

// Different cache durations for different data types
const CACHE_DURATIONS = {
  postsPerHour: 20 * 60 * 1000, // 20 minutes for time-series data
  commentsPerHour: 20 * 60 * 1000, // 20 minutes for time-series data
  labelingProgress: 12 * 60 * 60 * 1000  // 12 hours for labeling progress (less frequent updates)
};

// Helper function to check if cache is valid
const isCacheValid = (type) => {
  const now = Date.now();
  return cache[type] && (now - cacheTimestamps[type] < CACHE_DURATIONS[type]);
};

// Helper function to update cache
const updateCache = (type, data) => {
  cache[type] = data;
  cacheTimestamps[type] = Date.now();
};

export default async function handler(req, res) {
  const now = Date.now();
  const response = { now: new Date().toISOString() };
  
  try {
    // Only fetch posts data if cache is expired
    if (!isCacheValid('postsPerHour')) {
      const postsResult = await pool.query('SELECT hour, count FROM posts_per_hour ORDER BY hour ASC');
      updateCache('postsPerHour', postsResult.rows);
    }
    response.postsPerHour = cache.postsPerHour;
    
    // Only fetch comments data if cache is expired
    if (!isCacheValid('commentsPerHour')) {
      const commentsResult = await pool.query('SELECT hour, count FROM comments_per_hour ORDER BY hour ASC');
      updateCache('commentsPerHour', commentsResult.rows);
    }
    response.commentsPerHour = cache.commentsPerHour;
    
    // Only fetch labeling progress if cache is expired
    if (!isCacheValid('labelingProgress')) {
      // Use a single query with subqueries for better performance
      const progressResult = await pool.query(`
        SELECT 
          (SELECT COUNT(DISTINCT post_hash) FROM posts) as total,
          (SELECT COUNT(DISTINCT post_hash) FROM post_labels) as labeled
      `);
      
      updateCache('labelingProgress', {
        total: progressResult.rows[0]?.total || 0,
        labeled: progressResult.rows[0]?.labeled || 0
      });
    }
    response.labelingProgress = cache.labelingProgress;
    
    res.status(200).json(response);
  } catch (err) {
    console.error('API /api/stats error:', err);
    // If we have any cached data, return it even if there's an error with new data
    if (cache.postsPerHour && cache.commentsPerHour && cache.labelingProgress) {
      console.log('Serving stale cache due to error');
      return res.status(200).json({
        postsPerHour: cache.postsPerHour,
        commentsPerHour: cache.commentsPerHour,
        labelingProgress: cache.labelingProgress,
        now: new Date().toISOString(),
        fromStaleCache: true
      });
    }
    
    res.status(500).json({ error: err.message, details: err });
  }
}

