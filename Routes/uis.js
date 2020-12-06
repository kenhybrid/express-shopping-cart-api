const router = require("express").Router();
const controller = require("../Controllers/uiController");
const upload = require("../Middlewares/multerUi");

//get all uis
router.get("/", controller.all);

//get one ui
router.get("/:uiId", controller.one);

//create a ui
router.post("/", upload.single("avatar"), controller.create);

//delete a ui
router.delete("/:uiId", controller.delete);

//update a ui
router.patch("/:uiId", upload.single("avatar"), controller.update);

module.exports = router;
