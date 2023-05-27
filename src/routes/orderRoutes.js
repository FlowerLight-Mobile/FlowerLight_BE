const middlewareController = require('../controllers/middlewareController')
const orderController = require('../controllers/orderController')

const router = require('express').Router();
//Create order by User
router.post('/create-order', middlewareController.verifyToken, orderController.createOrder);
//Get All Order List by User (role Admin)
router.get('/', middlewareController.verifyTokenAdminFunction, orderController.getAllOrder);
module.exports = router;