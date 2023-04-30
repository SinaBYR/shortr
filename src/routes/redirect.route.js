const express = require('express');
const router = express.Router();
const { redirectLink } = require('../controllers/link.controller');

router.get('/:linkId', redirectLink);

module.exports = router;