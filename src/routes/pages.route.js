const express = require('express');
const router = express.Router();
const { renderIndexPage, renderLoginPage } = require('../controllers/pages-controller');
const session = require('../middleware/session');

router.get('/', renderIndexPage);

router.get('/login', session(), renderLoginPage);

module.exports = router;