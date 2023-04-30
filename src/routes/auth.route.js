const express = require('express');
const router = express.Router();
const session = require('../middleware/session');
const {
  createNewUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
  updateUser
} = require('../controllers/auth.controller');
const {
  validateNewUser,
  validateLogin,
  validateChangePassword,
  validateUpdateUser
} = require('../middleware/validate');

router.use(session());
router.use('/login', express.urlencoded({ extended: false }))
router.use('/register', express.urlencoded({ extended: false }))

router.post('/me/changePassword', validateChangePassword, changePassword);
router.put('/me', validateUpdateUser, updateUser);
router.post('/register', validateNewUser, createNewUser);
router.post('/login', validateLogin, loginUser);
router.get('/logout', logoutUser); // GET -> POST
router.get('/me', getCurrentUser);
router.use('*', (_, res) => res.redirect('/')); // fallback route

module.exports = router;