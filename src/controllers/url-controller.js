const pool = require('../../db/db');
const uniqId = require('uniqid');
const { validateUrl } = require('../../utils/utils');

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
      return res.json(existingUrl.rows[0]);
    }

    let urlId = uniqId();

    let result = await pool.query(
      'insert into url (original_url, url_id) values ($1, $2) returning *',
      [originalUrl, urlId]
    );

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

exports.redirectShortUrl = async (req, res) => {
  const { urlId } = req.params;

  try {
    let result = await pool.query(
      'select original_url from url where url_id = $1',
      [urlId]
    );

    if(!result.rowCount) {
      return res.json('Not found');
    }

    await pool.query(
      'update url set click_count = click_count + 1 where url_id = $1',
      [urlId]
    );

    res.redirect(result.rows[0].original_url);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}