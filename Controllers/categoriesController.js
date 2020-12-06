const Categories = require("../Models/Categories");

//create a category
exports.create = (req, res) => {
  const category = new Categories({
    c_name: req.body.c_name,
    c_subcategories: req.body.c_subcategories,
  });
  category
    .save()
    .then((doc) => {
      res.json({
        message: "Category created",
        doc
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to create category",
      });
    });
};

//get all categories
exports.all = (req, res) => {
  Categories.find({})
    .then((doc) => {
      if (doc.length < 1) {
        return res.json({
          error: "No Categories found"
        });
      }
      const count = doc.length;
      res.json({
        count,
        doc
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch categories"
      });
    });
};

//get one category
exports.one = (req, res) => {
  const id = req.params.categoryId;
  Categories.findById({
      _id: id
    })
    .then((doc) => {
      if (doc < 1) {
        return res.json({
          error: "Category dosn`t exist"
        });
      }
      res.json(doc);
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch category"
      });
    });
};

//delete a category
exports.delete = (req, res) => {
  const id = req.params.categoryId;
  //deleting from db
  Categories.deleteOne({
      _id: id
    })
    .then(() => {
      res.json({
        message: "Category is deleted"
      });
    })
    .catch((error) => {
      res.json({
        message: "Category  deletion failed"
      });
    });

};

//update a category
exports.update = (req, res) => {
  const id = req.params.categoryId;
  Categories.findById({
      _id: id
    })
    .then((doc) => {
      if (doc < 1) {
        return req.json({
          error: "Category not found"
        });
      }
      const update = {
        c_name: req.body.c_name || doc.c_name,
        c_subcategories: req.body.c_subcategories || doc.c_subcategories,
      };
      Categories.updateOne({
          _id: id
        }, update)
        .then((doc) => {
          res.json({
            message: "Category has been updated"
          });
        })
        .catch((error) => {
          res.json({
            message: "Category was not updated"
          });
        });
    })
    .catch((error) => {
      res.json({
        message: "Category not found"
      });
    });
};