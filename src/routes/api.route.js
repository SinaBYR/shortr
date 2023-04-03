const express = require('express');
const router = express.Router();
const {
  createNewShortUrl,
  getAllUrls,
  deleteShortLink,
  getUrl,
  updateLink,
  switchActivationState
} = require('../controllers/url.controller');
const session = require('../middleware/session');
const { validateNewUrl, validateUpdateUrl } = require('../middleware/validate');

router.use(session());

router.post('/urls/:urlId/switchActivationState', switchActivationState);
router.patch('/urls/:urlId', validateUpdateUrl, updateLink);
router.get('/urls/:urlId', getUrl);
router.delete('/urls/:urlId', deleteShortLink);
router.post('/new', validateNewUrl, createNewShortUrl);
router.get('/urls', getAllUrls);

module.exports = router;