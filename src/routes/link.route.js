const express = require('express');
const router = express.Router();
const {
  createNewLink,
  getAllLinks,
  deleteLink,
  getLink,
  updateLink,
  switchActivationState
} = require('../controllers/link.controller');
const session = require('../middleware/session');
const {
  validateNewLink,
  validateUpdateLink
} = require('../middleware/validate');

router.use(session());

router.post('/links/:linkId/switchActivationState', switchActivationState);
router.patch('/links/:linkId', validateUpdateLink, updateLink);
router.get('/links/:linkId', getLink);
router.delete('/links/:linkId', deleteLink);
router.post('/links', validateNewLink, createNewLink);
router.get('/links', getAllLinks);

module.exports = router;