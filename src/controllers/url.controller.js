const pool = require('../../db/db');
const uniqId = require('uniqid');
const { validationResult } = require('express-validator');

exports.switchActivationState = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let urlId = req.params.urlId;

    await pool.query(`
      UPDATE url
      SET is_active = NOT is_active
      WHERE user_id = $1 AND url_id = $2;
    `, [req.session.user.id, urlId]);

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
    let urlId = req.params.urlId;
    let newUrlId = req.body.urlId;

    let result = await pool.query(`
      update url
      set url_id = $1
      where user_id = $2 and url_id = $3 and not exists (
        select 1 from url where url_id = $1
      ) returning url_id
    `, [newUrlId, req.session.user.id, urlId]);

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

exports.getUrl = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }
  
  try {
    let urlId = req.params.urlId;

    let result = await pool.query(`
      select original_url, protocol, click_count, is_active
      from url
      where user_id = $1 and url_id = $2
    `, [req.session.user.id, urlId]);

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

exports.deleteShortLink = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let urlId = req.params.urlId;
    let result = await pool.query(`
      delete from url
      where user_id = $1 and url_id = $2
    `, [req.session.user.id, urlId]);

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

exports.getAllUrls = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  try {
    let userId = req.session.user.id;
    let urlsResult = await pool.query(`
      select id, protocol || '://' || original_url as url, url_id, click_count, is_active
      from url
      where user_id = $1
    `, [userId]);

    res.json(urlsResult.rows);
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
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
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.redirectShortUrl = async function(req, res) {
  const { urlId } = req.params;

  try {
    let result = await pool.query(
      'select original_url, protocol, is_active from url where url_id = $1',
      [urlId]
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
      'update url set click_count = click_count + 1 where url_id = $1',
      [urlId]
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