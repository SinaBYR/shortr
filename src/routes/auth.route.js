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
router.get('/logout', logoutUser);
router.get('/me', getCurrentUser);
router.use('*', (_, res) => res.redirect('/')); // fallback route

module.exports = router;