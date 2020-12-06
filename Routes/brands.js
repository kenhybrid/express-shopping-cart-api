const router = require("express").Router();
const controller = require("../Controllers/brandsController");
const upload = require("../Middlewares/multerBrands");

//get all brands
router.get("/", controller.all);

//get one brand
router.get("/:brandId", controller.one);

//create a brand
router.post("/", upload.single("avatar"), controller.create);

//delete a brand
router.delete("/:brandId", controller.delete);

//update a brand
router.patch("/:brandId", upload.single("avatar"), controller.update);

module.exports = router;
