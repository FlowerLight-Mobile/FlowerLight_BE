const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

//Get All User
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//Get User by ID
router.get("/user/:id", userController.getUser);

//Update Password
router.put("/user/:id/change-password", middlewareController.verifyToken, userController.changePassword);

//DELETE User
router.delete("/user/:id", middlewareController.verifyTokenisAdmin, userController.deleteUser)
module.exports = router