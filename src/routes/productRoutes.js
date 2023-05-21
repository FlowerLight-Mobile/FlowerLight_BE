const middlewareController = require("../controllers/middlewareController");
const productController = require("../controllers/productController");

const router = require("express").Router();

router.post('/create-product', middlewareController.verifyTokenAdminFunction, productController.createProduct)
router.get('/', middlewareController.verifyToken, productController.getProducts);
router.get('/product/:id', middlewareController.verifyToken, productController.getProductbById);
router.delete('/product/:id', middlewareController.verifyTokenAdminFunction, productController.deleteProduct)
module.exports = router;