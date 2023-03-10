const pool = require('../../db/db');
const { validationResult } = require('express-validator');

exports.logoutUser = function(req, res) {
  if(!req.session.user) {
    return res.status(400).render('pages/login.ejs');
  }

  req.session.destroy();
  // 1. send logout was successful.
  res.render('pages/login.ejs');
}

exports.createNewUser = async function(req, res) {
  let { body } = req;
  let errors = validationResult(req).array().map(err => err.msg);
  
  if(errors.length) {
    return res.status(400).render('pages/register', {
      errors,
      formData: {
        username: body.username,
        password: body.password
      }
    })
  }

  try {

    // 1. hash password
    // 2. retrieve id column
    let registerUserRes = await pool.query(`
      insert into user_account (username, password)
      values ($1, $2) returning username;
    `,[body.username, body.password]);

    if(!registerUserRes.rowCount) {
      throw new Error('An unexpected error occured.');
    }

    req.session.user = {
      username: body.username
    };

    req.session.save();

    // 1. render a view
    res.status(201).json('User account created successfully.');
  } catch(err) {
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
        username: body.username,
        password: body.password,
      }
    })
  }

  try {
    let loginUserResponse = await pool.query(`
      select username, password
      from user_account
      where username = $1;
    `, [body.username]);

    if(!loginUserResponse.rowCount) {
      // 1. username not found. want to register?
      // return res.status(400).render('pages/login');
      return res.json('username not found.');
    }

    if(loginUserResponse.rows[0].password !== body.password) {
      // 1. send username/password incorrectness error.
      // return res.status(400).render('pages/login');
      return res.json('username/password incorrect')
    }

    req.session.user = {
      username: body.username
    };

    req.session.save();
    
    // 1. send user info alongside other resources.
    // res.render('pages/login');
    res.json('cool')
  } catch(err) {
    // 1. render a 500 error page.
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
      select username
      from user_account
      where username = $1;
    `, [user.username]);

    if(!fetchUserRes.rowCount) {
      return res.status(404).send('User not found.');
    }

    // 1. render a view
    res.json(fetchUserRes.rows[0]);
  } catch(err) {
    res.status(500).send(err.message); // or "Server Error"
  }
}