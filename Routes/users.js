const router = require("express").Router();
const controller = require("../Controllers/usersController");

//get all users
router.get("/", controller.all);

//register
router.post("/register", controller.register);

//login
router.post("/login", controller.login);

//change password
router.patch("/change/:userId", controller.change);

//delete user
router.delete("/:userId", controller.delete);

//reset password
router.patch("/reset", controller.reset);

module.exports = router;
