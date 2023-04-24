const pool = require('../../db/db');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.logoutUser = function(req, res) {
  if(!req.session.user) {
    return res.redirect('/login');
  }

  req.session.user = null;
  req.session.save(function(err) {
    // 1. req.session.user is not available. what to do?
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
    let hashedPassword = await bcrypt.hash(body.password, 10);
    let registerUserResponse = await pool.query(`
      INSERT INTO user_account (email, fullName, password)
      VALUES ($1, $2, $3) RETURNING id, fullname;
    `,[body.email, body.fullName, hashedPassword]);

    if(!registerUserResponse.rowCount) {
      return res.status(500).render('pages/500');
    }

    req.session.regenerate(function(err) {
      if(err) return res.status(500).render('pages/500');

      req.session.user = {
        id: registerUserResponse.rows[0].id,
        email: body.email,
        fullName: registerUserResponse.rows[0].fullname
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
      SELECT id, fullname, email, password
      FROM user_account
      WHERE email = $1;
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

    let match = await bcrypt.compare(body.password, loginUserResponse.rows[0].password);

    if(!match) {
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
        email: body.email,
        fullName: loginUserResponse.rows[0].fullname
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
    res.status(500).render('pages/500', { user: req.session.user });
  }
}

exports.updateUser = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).json(errors);
  }

  try {
    let { fullName, email } = req.body;
    let result = await pool.query(`
      UPDATE user_account
      SET email = $1, fullname = $2
      WHERE id = $3 AND NOT EXISTS (
        SELECT 1 FROM user_account WHERE id != $3 AND email = $1
      ) RETURNING email, fullName
    `, [email, fullName, req.session.user.id]);

    if(!result.rowCount) {
      return res.status(409).json({ message: 'آدرس ایمیل قبلا انتخاب شده است' });
    }

    req.session.user.email = result.rows[0].email;
    req.session.user.fullName = result.rows[0].fullname;

    req.session.save(function(err) {
      if(err) return res.status(500).render('pages/500');

      res.status(200).json(result.rows[0]);
    })
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}

exports.changePassword = async function(req, res) {
  if(!req.session.user) {
    return res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
  }

  let errors = validationResult(req).array().map(err => err.msg);

  if(errors.length) {
    return res.status(400).json(errors);
  }

  try {
    let { currentPassword, newPassword } = req.body;

    let check = await pool.query(`
      SELECT password
      FROM user_account
      WHERE id = $1
    `, [req.session.user.id]);

    let match = await bcrypt.compare(currentPassword, check.rows[0].password);

    if(!match) {
      return res.status(409).json({ message: 'رمزعبور فعلی همخوانی ندارد' });
    }

    let currentPasswordHashed = check.rows[0].password;

    let isPasswordSame = await bcrypt.compare(newPassword, currentPasswordHashed);

    if(isPasswordSame) {
      return res.status(409).json({ message: 'رمزعبور جدید با رمزعبور فعلی نمی تواند یکسان باشد' });
    }

    let newPasswordHashed = await bcrypt.hash(newPassword, 10);

    await pool.query(`
      UPDATE user_account
      SET password = $1
      WHERE id = $2 AND password = $3
    `, [newPasswordHashed, req.session.user.id, currentPasswordHashed]);

    res.status(200).json('OK');
  } catch(err) {
    res.status(500).render('pages/500', {
      user: req.session.user
    });
  }
}