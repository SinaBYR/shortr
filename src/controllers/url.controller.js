const pool = require('../../db/db');
const uniqId = require('uniqid');
const { validationResult } = require('express-validator');

exports.getUrl = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }
  
  try {
    let urlId = req.params.urlId;

    let result = await pool.query(`
      select original_url, click_count
      from url
      where user_id = $1 and url_id = $2
    `, [req.session.user.id, urlId]);

    if(!result.rowCount) {
      return res.status(404).send('Resource Not Found');
    }

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

exports.deleteShortLink = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).json(errors);
  }

  try {
    let urlId = req.params.urlId;
    let result = await pool.query(`
      delete from url
      where user_id = $1 and url_id = $2
    `, [req.session.user.id, urlId]);

    if(!result.rowCount) {
      return res.status(404).send('Resource Not Found');
    }

    res.status(204).json(result);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

exports.getAllUrls = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let userId = req.session.user.id;
    let urlsResult = await pool.query(`
      select id, protocol || '://' || original_url as url, url_id, click_count
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

    let { url : originalUrl, protocol } = req.body;
    let urlId = uniqId();

    let result = await pool.query(
      'insert into url (original_url, url_id, protocol, user_id) values ($1, $2, $3, $4) returning url_id',
      [originalUrl, urlId, protocol, req.session.user.id]
    );

    res.status(201).json(result.rows[0]);
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