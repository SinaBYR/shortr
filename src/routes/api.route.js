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
const {
  validateNewUrl,
  validateUpdateUrl,
  validateUpdateUser,
  validateChangePassword
} = require('../middleware/validate');
const { updateUser, changePassword } = require('../controllers/auth.controller');

router.use(session());

router.post('/me/changePassword', validateChangePassword, changePassword);
router.put('/me', validateUpdateUser, updateUser);
router.post('/urls/:urlId/switchActivationState', switchActivationState);
router.patch('/urls/:urlId', validateUpdateUrl, updateLink);
router.get('/urls/:urlId', getUrl);
router.delete('/urls/:urlId', deleteShortLink);
router.post('/new', validateNewUrl, createNewShortUrl);
router.get('/urls', getAllUrls);

module.exports = router;