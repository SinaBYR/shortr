const express = require('express');
const router = express.Router();
const {
  renderIndexPage,
  renderLoginPage,
  renderRegisterPage,
  renderDashboardPage,
  renderCreateNewUrlPage,
  renderEditPage,
  renderAboutPage,
  renderAccountPage
} = require('../controllers/pages.controller');
const session = require('../middleware/session');

router.use(session());

router.get('/', renderIndexPage);
router.get('/about', renderAboutPage);
router.get('/login', renderLoginPage);
router.get('/register', renderRegisterPage);
router.get('/account', renderAccountPage);
router.get('/dashboard', renderDashboardPage);
router.get('/dashboard/new', renderCreateNewUrlPage);
router.get(/\/edit\/\w*\/?$/i, renderEditPage);

module.exports = router;