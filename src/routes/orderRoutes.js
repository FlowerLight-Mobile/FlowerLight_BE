const middlewareController = require('../controllers/middlewareController')
const orderController = require('../controllers/orderController')

const router = require('express').Router()

router.post('/create-order', middlewareController.verifyToken, orderController.createOrder);

module.exports = router;