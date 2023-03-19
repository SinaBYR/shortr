const express = require('express');
const router = express.Router();
const { createNewShortUrl, getAllUrls, deleteShortLink } = require('../controllers/url.controller');
const session = require('../middleware/session');
const { validateNewUrl, validateDeleteUrl } = require('../middleware/validate');

router.use(session());

router.delete('/urls/:urlId', validateDeleteUrl, deleteShortLink);
router.post('/new', validateNewUrl, createNewShortUrl);
router.get('/urls', getAllUrls);

module.exports = router;