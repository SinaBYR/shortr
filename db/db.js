const pg = require('pg');

const pool = new pg.Pool({
  database: 'shortr',
  host: '127.0.0.1',
  port: 5432,
  user: 'sina'
});

module.exports = pool;