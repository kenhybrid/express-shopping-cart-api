const router = require("express").Router();
const controller = require("../Controllers/productsController");
const upload = require("../Middlewares/multerProducts");

//get all products
router.get("/", controller.all);

//get one product
router.get("/:productId", controller.one);

//create a product
router.post("/", upload.single("avatar"), controller.create);

//delete a product
router.delete("/:productId", controller.delete);

//update a product
router.patch("/:productId", upload.single("avatar"), controller.update);

module.exports = router;
