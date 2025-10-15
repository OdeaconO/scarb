// db/index.js
// Simple PostgreSQL Pool wrapper. Configure via env vars.
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // preferred
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // ssl: { rejectUnauthorized: false } // uncomment if using managed DB that requires SSL
});

module.exports = pool;
