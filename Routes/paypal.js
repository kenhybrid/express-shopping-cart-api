const router = require("express").Router();
const controller = require("../Controllers/paypalController");

//get all success route
router.get("/success", controller.success);

//create a payment
router.post("/pay", controller.pay);

//delete an order
router.get("/cancel", controller.cancel);


module.exports = router;
