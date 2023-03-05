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
    // render a view
    return res.status(401).json('Authentication failed');
  }

  try {
    // hash password
    const registerRes = await pool.query(`
      insert into user_account (username, password)
      values ($1, $2) returning username;
    `,[username, password]);

    if(!registerRes.rowCount) {
      throw new Error('An unexpected error occured.');
    }

    req.session.user = {
      username
    };

    // render a view
    res.status(201).json('User account created successfully.');
  } catch(err) {
    res.status(500).json(err.message);
  }
})

module.exports = router;