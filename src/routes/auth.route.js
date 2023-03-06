const express = require('express');
const router = express.Router();
const session = require('../middleware/session');
const { createNewUser, loginUser, getCurrentUser, logoutUser } = require('../controllers/auth.controller');

router.use(session());
router.use('/login', express.urlencoded({ extended: false }))

router.post('/new', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

module.exports = router;