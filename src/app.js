const express = require('express');
const app = express();
const path = require('path');
const LinkRoutes = require('./routes/link.route');
const RedirectRoutes = require('./routes/redirect.route');
const PageRoutes = require('./routes/pages.route');
const AuthRoutes = require('./routes/auth.route');
const { render404Page } = require('./controllers/pages.controller');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', AuthRoutes);
app.use('/api', LinkRoutes);
app.use('/', PageRoutes);
app.use('/', RedirectRoutes);
app.get('*', render404Page);

module.exports = app;
