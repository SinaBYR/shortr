const expressSession = require('express-session');
const connectPsqlSimple = require('connect-pg-simple');
const PostgreSqlStore = connectPsqlSimple(expressSession);
const sessionStore = new PostgreSqlStore({
  conString: 'postgresql://postgres:Sina13801111@127.0.0.1:5432/shortr',
});

function session() {
  return expressSession({
    name: 'shortr',
    secret: 'my cute kitten',
    cookie: {
      maxAge: 60*60000
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
}

module.exports = session;