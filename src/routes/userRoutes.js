const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

//Get All User
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//Get User by ID
router.get("/user/:id", middlewareController.verifyToken, userController.getUser);
//Update information User
router.put("/user/update-info/:id", middlewareController.verifyTokenUser, userController.updateInfoUser);
//Change Password
router.put("/user/change-password/:id", middlewareController.verifyTokenUser, userController.changePassword);
//Reset Pasword 

//DELETE User
router.delete("/user/:id", middlewareController.verifyTokenisAdminandUser, userController.deleteUser);
module.exports = router