const authController = require('../controllers/authController');

const router = require('express').Router();
//USER
router.post('/signup', authController.signupUser); //Signup
router.post('/login', authController.loginUser); //Login

module.exports = router