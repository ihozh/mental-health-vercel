// Database connection for Neon (Postgres)
import { Pool } from 'pg';

const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.NEON_DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export default pool;
