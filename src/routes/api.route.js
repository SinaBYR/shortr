const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url-controller');

router.post('/new', urlController.createNewShortUrl);

module.exports = router;