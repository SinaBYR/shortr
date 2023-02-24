const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url-controller');

router.get('/:urlId', urlController.redirectShortUrl);

module.exports = router;