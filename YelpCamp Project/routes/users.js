const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegistrationForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, 
                      passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
                      users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;