const userController = require("../controllers/userController");

const router = require("express").Router();

//Get All User
router.get("/", userController.getAllUsers);

//Get User by ID
router.get("/user/:id", userController.getUser);

//Update Password
router.put("/user/:id/change-password", userController.changePassword);

//DELETE User
router.delete("/user/:id", userController.deleteUser)
module.exports = router