const express = require('express');
const router = express.Router();
const session = require('../middleware/session');
const { createNewUser, loginUser, getCurrentUser, logoutUser } = require('../controllers/auth.controller');
const { validateNewUser, validateLogin } = require('../middleware/validate');

router.use(session());
router.use('/login', express.urlencoded({ extended: false }))
router.use('/new', express.urlencoded({ extended: false }))

router.post('/new', validateNewUser, createNewUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

module.exports = router;