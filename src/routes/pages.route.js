const express = require('express');
const router = express.Router();
const { renderIndexPage } = require('../controllers/pages-controller');

router.get('/', renderIndexPage);

module.exports = router;