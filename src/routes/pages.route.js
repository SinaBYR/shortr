const express = require('express');
const router = express.Router();
const { renderIndexPage, renderLoginPage, renderRegisterPage } = require('../controllers/pages-controller');
const session = require('../middleware/session');

router.get('/', renderIndexPage);

router.get('/login', session(), renderLoginPage);
router.get('/register', session(), renderRegisterPage);

module.exports = router;