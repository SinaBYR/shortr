const pool = require('../../db/db');
const uniqId = require('uniqid');
const { validationResult } = require('express-validator');

exports.switchActivationState = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let linkId = req.params.linkId;

    await pool.query(`
      UPDATE link
      SET is_active = NOT is_active
      WHERE user_id = $1 AND url_id = $2;
    `, [req.session.user.id, linkId]);

    res.status(204).end();
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.updateLink = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).json(errors);
  }

  try {
    let linkId = req.params.linkId;
    let newLinkId = req.body.linkId;

    let result = await pool.query(`
      UPDATE link
      SET url_id = $1
      WHERE user_id = $2 AND url_id = $3 AND NOT EXISTS (
        SELECT 1 FROM link WHERE url_id = $1
      ) RETURNING url_id
    `, [newLinkId, req.session.user.id, linkId]);

    if(!result.rowCount) {
      // 1. undefined url_id is unhandled (Resource not found)
      return res.status(409).json({
        message: 'آی دی مورد نظر قبلا انتخاب شده است'
      });
    }

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.getLink = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }
  
  try {
    let linkId = req.params.linkId;

    let result = await pool.query(`
      SELECT original_url, protocol, click_count, is_active, created_at
      FROM link
      WHERE user_id = $1 AND url_id = $2
    `, [req.session.user.id, linkId]);

    if(!result.rowCount) {
      return res.status(404).json({
        message: 'پرونده موردنظر یافت نشد'
      });
    }

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.deleteLink = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let linkId = req.params.linkId;
    let result = await pool.query(`
      DELETE FROM link
      WHERE user_id = $1 AND url_id = $2
    `, [req.session.user.id, linkId]);

    if(!result.rowCount) {
      return res.status(404).json({
        message: 'پرونده موردنظر یافت نشد'
      });
    }

    res.status(204).json(result);
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.getAllLinks = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let userId = req.session.user.id;
    let urlsResult = await pool.query(`
      SELECT id, protocol || '://' || original_url AS url, url_id, click_count, is_active, created_at
      FROM link
      WHERE user_id = $1
      ORDER BY created_at
    `, [userId]);

    res.json(urlsResult.rows);
  } catch(err) {
    res.status(500).end();
  }
}

exports.createNewLink = async function(req, res) {
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
    let linkId = uniqId();

    let result = await pool.query(
      'INSERT INTO link (original_url, url_id, protocol, user_id) VALUES ($1, $2, $3, $4) RETURNING url_id',
      [originalUrl, linkId, protocol, req.session.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.redirectLink = async function(req, res) {
  const { linkId } = req.params;

  try {
    let result = await pool.query(
      'SELECT original_url, protocol, is_active FROM link WHERE url_id = $1',
      [linkId]
    );

    if(!result.rowCount || !result.rows[0].is_active) {
      if(req.session.user) {
        return res.status(404).render('pages/404', {
          user: req.session.user
        });
      }

      return res.status(404).render('pages/404');
    }

    await pool.query(
      'UPDATE link SET click_count = click_count + 1 WHERE url_id = $1',
      [linkId]
    );

    let completeUrl = result.rows[0].protocol + '://' + result.rows[0].original_url;

    res.redirect(completeUrl);
  } catch(err) {
    if(req.session.user) {
      return res.status(500).render('pages/500', {
        user: req.session.user
      });
    }

    res.status(500).render('pages/500');
  }
}