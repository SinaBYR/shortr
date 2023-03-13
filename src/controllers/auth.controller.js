const pool = require('../../db/db');
const { validationResult } = require('express-validator');

exports.logoutUser = function(req, res) {
  if(!req.session.user) {
    return res.redirect('/login');
  }

  req.session.user = null;
  req.session.save(function(err) {
    // 1. redirect to a 500 error view
    if(err) return res.status(500).json(err.message);

    req.session.regenerate(function(err) {
      // 1. redirect to a 500 error view
      if(err) return res.status(500).json(err.message);

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
    let registerUserRes = await pool.query(`
      insert into user_account (email, fullName, password)
      values ($1, $2, $3) returning email;
    `,[body.email, body.fullName, body.password]);

    if(!registerUserRes.rowCount) {
      // 1. this is a better way of handling server errors.
      // 2. update other routes to implement this way.
      throw new Error('An unexpected error occured.');
    }

    req.session.regenerate(function(err) {
      // 1. redirect to a 500 error view
      if(err) return res.status(500).json(err.message);

      req.session.user = {
        email: body.email
      };

      req.session.save(function(err) {
        // 1. redirect to a 500 error view
        if(err) return res.status(500).json(err.message);

        res.redirect('/dashboard');
      })
    })
  } catch(err) {
    // 1. redirect to a 500 error view
    res.status(500).json(err.message);
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
      select email, password
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
      // 1. redirect to a 500 error view
      if(err) return res.status(500).json(err.message);

      req.session.user = {
        email: body.email
      };

      req.session.save(function(err) {
        // 1. redirect to a 500 error view
        if(err) return res.status(500).json(err.message);

        res.redirect('/dashboard');
      })
    })
  } catch(err) {
    // 1. redirect to a 500 error view
    res.status(500).send('Server Error');
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
    // 1. redirect to a 500 error view
    res.status(500).send(err.message); // or "Server Error"
  }
}