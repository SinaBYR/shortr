const express = require('express');
const router = express.Router();
const { renderIndexPage, renderLoginPage, renderRegisterPage } = require('../controllers/pages-controller');
const session = require('../middleware/session');

router.use(session());

router.get('/', renderIndexPage);
router.get('/login', renderLoginPage);
router.get('/register', renderRegisterPage);

module.exports = router;