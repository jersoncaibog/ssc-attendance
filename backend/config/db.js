const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_SERVICE_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 