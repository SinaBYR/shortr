const express = require('express');
const router = express.Router();
const session = require('express-session');
const pool = require('../../db/db');
const connectPsqlSimple = require('connect-pg-simple');
const PostgreSqlStore = connectPsqlSimple(session);
const sessionStore = new PostgreSqlStore({
  conString: 'postgresql://sina:Sina13801111@127.0.0.1:5432/shortr'
});

router.use(session({
  secret: 'my cute kitten',
  cookie: {
    maxAge: 2*60000
  },
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

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