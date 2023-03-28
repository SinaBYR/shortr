const express = require('express');
const router = express.Router();
const { createNewShortUrl, getAllUrls, deleteShortLink, getUrl, updateLink } = require('../controllers/url.controller');
const session = require('../middleware/session');
const { validateNewUrl, validateDeleteUrl, validateUpdateUrl } = require('../middleware/validate');

router.use(session());

router.patch('/urls/:urlId', validateUpdateUrl, updateLink);
router.get('/urls/:urlId', getUrl);
router.delete('/urls/:urlId', validateDeleteUrl, deleteShortLink);
router.post('/new', validateNewUrl, createNewShortUrl);
router.get('/urls', getAllUrls);

module.exports = router;