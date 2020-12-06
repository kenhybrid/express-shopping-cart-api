const router = require("express").Router();
const controller = require("../Controllers/ordersController");

//get all orders
router.get("/", controller.all);

//get one order
router.get("/:orderId", controller.one);

//create an order
router.post("/", controller.create);

//delete an order
router.delete("/:orderId", controller.delete);

//update an order
// router.patch("/:orderId", controller.update);

module.exports = router;
