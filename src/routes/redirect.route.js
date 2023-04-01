const express = require('express');
const router = express.Router();
const { redirectShortUrl } = require('../controllers/url.controller');

router.get('/:urlId', redirectShortUrl);

module.exports = router;