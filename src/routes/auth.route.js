const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const session = require('../middleware/session');

router.use(session());

router.post('/new', async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    // 1. render a view
    return res.status(401).json('Authentication failed');
  }

  try {
    // 1. hash password
    // 2. retrieve id column
    const registerUserRes = await pool.query(`
      insert into user_account (username, password)
      values ($1, $2) returning username;
    `,[username, password]);

    if(!registerUserRes.rowCount) {
      throw new Error('An unexpected error occured.');
    }

    req.session.user = {
      username
    };

    // 1. render a view
    res.status(201).json('User account created successfully.');
  } catch(err) {
    res.status(500).json(err.message);
  }
})

router.get('/me', async (req, res) => {
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
})

module.exports = router;