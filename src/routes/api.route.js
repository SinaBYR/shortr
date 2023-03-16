const express = require('express');
const router = express.Router();
const { createNewShortUrl } = require('../controllers/url-controller');
const session = require('../middleware/session');
const { validateNewUrl } = require('../middleware/validate');

router.use(session());

router.post('/new', validateNewUrl, createNewShortUrl);

module.exports = router;