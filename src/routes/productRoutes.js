const middlewareController = require("../controllers/middlewareController");
const productController = require("../controllers/productController");

const router = require("express").Router();

router.post('/create-product', middlewareController.verifyTokenAdminFunction, productController.createProduct)
router.get('/products', productController.getProducts)
module.exports = router;