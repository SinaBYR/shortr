const pool = require('../../db/db');
const { validationResult } = require('express-validator');

exports.logoutUser = function(req, res) {
  if(!req.session.user) {
    return res.redirect('/login');
  }

  req.session.user = null;
  req.session.save(function(err) {
    if(err) return res.status(500).render('pages/500');

    req.session.regenerate(function(err) {
      if(err) return res.status(500).render('pages/500');

      // 1. send logout feedback in a different way, and use redirect instead of render
      res.render('pages/login', {
        logoutFeedback: {
          message: 'شما با موفقیت از حساب کاربری خود خارج شدید'
        }
      });
    })
  })
}

exports.createNewUser = async function(req, res) {
  let { body } = req;
  let errors = validationResult(req).array().map(err => err.msg);
  
  if(errors.length) {
    return res.status(400).render('pages/register', {
      errors,
      formData: {
        email: body.email,
        fullName: body.fullName,
        password: body.password
      }
    })
  }

  try {

    // 1. hash password
    // 2. retrieve id, fullName columns
    let registerUserResponse = await pool.query(`
      insert into user_account (email, fullName, password)
      values ($1, $2, $3) returning id;
    `,[body.email, body.fullName, body.password]);

    if(!registerUserResponse.rowCount) {
      return res.status(500).render('pages/500');
    }

    req.session.regenerate(function(err) {
      if(err) return res.status(500).render('pages/500');

      req.session.user = {
        id: registerUserResponse.rows[0].id,
        email: body.email
      };

      req.session.save(function(err) {
        if(err) return res.status(500).render('pages/500');

        res.redirect('/dashboard');
      })
    })
  } catch(err) {
    if(err.code === '23505') {
      return res.status(409).render('pages/register', {
        errors: ['آدرس ایمیل قبلا ثبت شده است'],
        formData: {
          email: body.email,
          fullName: body.fullName,
          password: body.password
        }
      })
    }

    res.status(500).render('pages/500');
  }
}

exports.loginUser = async function (req, res) {
  let { body } = req;
  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).render('pages/login', {
      errors,
      formData: {
        email: body.email,
        password: body.password,
      }
    })
  }

  try {
    let loginUserResponse = await pool.query(`
      select id, email, password
      from user_account
      where email = $1;
    `, [body.email]);

    if(!loginUserResponse.rowCount) {
      return res.render('pages/login', {
        errors: ['آدرس ایمیل نادرست می باشد'],
        formData: {
          email: body.email,
          password: body.password
        }
      })
    }

    if(loginUserResponse.rows[0].password !== body.password) {
      return res.render('pages/login', {
        errors: ['آدرس ایمیل یا رمزعبور نادرست می باشد'],
        formData: {
          email: body.email,
          password: body.password
        }
      })
    }

    req.session.regenerate(function(err) {
      if(err) return res.status(500).render('pages/500');

      req.session.user = {
        id: loginUserResponse.rows[0].id,
        email: body.email
      };

      req.session.save(function(err) {
        if(err) return res.status(500).render('pages/500');

        res.redirect('/dashboard');
      })
    })
  } catch(err) {
    res.status(500).render('pages/500');
  }
}

exports.getCurrentUser = async function(req, res) {
  const { user } = req.session;
  if(!user) {
    return res.status(401).json('Authentication failed');
  }

  try {
    // 1. add other info to the table
    const fetchUserRes = await pool.query(`
      select email
      from user_account
      where email = $1;
    `, [user.email]);

    if(!fetchUserRes.rowCount) {
      return res.status(404).send('User not found.');
    }

    // 1. render a view
    res.json(fetchUserRes.rows[0]);
  } catch(err) {
    res.status(500).render('pages/500');
  }
}