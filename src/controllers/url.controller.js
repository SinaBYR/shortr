const pool = require('../../db/db');
const uniqId = require('uniqid');
const { validationResult } = require('express-validator');

exports.getAllUrls = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let userId = req.session.user.id;
    let urlsResult = await pool.query(`
      select id, original_url, url_id, click_count
      from url
      where user_id = $1
    `, [userId]);

    res.json(urlsResult.rows);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

exports.createNewShortUrl = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).json(errors);
  }

  try {
    // 1. Don't let duplicates through maybe??
    // let existingUrl = await pool.query(
    //   'select * from url where original_url = $1',
    //   [originalUrl]
    // );

    // if(existingUrl.rowCount) {
    //   return res.json(existingUrl.rows[0]);
    // }

    let originalUrl = req.body.url;
    let urlId = uniqId();

    await pool.query(
      'insert into url (original_url, url_id, user_id) values ($1, $2, $3)',
      [originalUrl, urlId, req.session.user.id]
    );

    res.status(201).end();
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

exports.redirectShortUrl = async function(req, res) {
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