const router = require("express").Router();
const controller = require("../Controllers/categoriesController");

//get all categories
router.get("/", controller.all);

//get one categorie
router.get("/:categoryId", controller.one);

//create a categorie
router.post("/", controller.create);

//delete a categorie
router.delete("/:categoryId", controller.delete);

//update a categorie
router.patch("/:categoryId", controller.update);

module.exports = router;
