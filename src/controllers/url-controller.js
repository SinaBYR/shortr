const pool = require('../db/db');
const uniqId = require('uniqid');
const { validateUrl } = require('../utils/utils');

exports.createNewShortUrl = async (req, res) => {
  const originalUrl = req.body.url;
  const valid = validateUrl(originalUrl);
  if(!valid) {
    res.status(400).json('Invalid Original URL');
  }

  try {
    let existingUrl = await pool.query(
      'select * from url where original_url = $1',
      [originalUrl]
    );

    if(existingUrl.rowCount) {
      res.json(existingUrl.rows[0]);
    }

    let uniqeSeg = uniqId();
    let shortUrl = '127.0.0.1:3000/' + uniqeSeg;

    let result = await pool.query(
      'insert into url (original_url, short_url) values ($1, $2) returning *',
      [originalUrl, shortUrl]
    );

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}