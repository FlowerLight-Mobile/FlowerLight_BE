const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();
//USER
router.post('/signup', authController.signupUser); //Signup
router.post('/login', authController.loginUser); //Login
router.post('/logout', middlewareController.verifyToken, authController.userLogout);
//Refesh
router.post('/refesh', authController.requestRefeshToken)

module.exports = router