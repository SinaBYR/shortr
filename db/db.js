const pg = require('pg');

const pool = new pg.Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
});

module.exports = pool;