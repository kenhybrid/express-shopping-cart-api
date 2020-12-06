const Products = require("../Models/Products");
const fs = require("fs");
const { URL } = require("../Config");

//create a product
exports.create = (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.json({
      error: "upload a file",
    });
    return next();
  }
  const product = new Products({
    p_name: req.body.p_name,
    p_category: req.body.p_category,
    p_subcategory: req.body.p_subcategory,
    p_quantity: req.body.p_quantity,
    p_colors: req.body.p_colors,
    p_price: parseFloat(req.body.p_price),
    p_image: file.path,
    p_description: req.body.p_description,
    p_shipping: req.body.p_shipping,
    p_brand: req.body.p_brand,
    p_discount: req.body.p_discount,
  });
  product
    .save()
    .then((doc) => {
      res.json({
        message: "Product created",
        doc,
      });
    })
    .catch((error) => {
      res.json({
        error: "Could not create product",
      });
    });
};

//get all products
exports.all = (req, res) => {
  Products.find({})
    .then((doc) => {
      if (doc.length < 1) {
        res.json({
          error: "No Products found",
        });
      } else {
        const count = doc.length;
        res.json({
          count,
          doc,
          URL,
        });
      }
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch products",
      });
    });
};

//get one product
exports.one = (req, res) => {
  const id = req.params.productId;
  Products.findById({
    _id: id,
  })
    .then((doc) => {
      if (doc < 1) {
        return res.json({
          error: "No Product found",
        });
      }
      res.json({
        doc,
        URL,
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch product",
      });
    });
};

//delete a product
exports.delete = (req, res) => {
  const id = req.params.productId;
  Products.findById({
    _id: id,
  }).then((doc) => {
    // deleting from uploads
    fs.unlink(doc.p_image, (err) => {
      if (err) {
        console.log(err);
      } else {
        //deleting from db
        Products.deleteOne({
          _id: id,
        })
          .then(() => {
            res.json({
              message: "Product is deleted",
            });
          })
          .catch((error) => {
            res.json({
              message: "Product  deletion failed",
            });
          });
      }
    });
  });
};

//update a product final with image
exports.update = (req, res, next) => {
  //get id and file
  const id = req.params.productId;
  const file = req.file;
  // check if file is present
  if (file) {
    Products.findById({
      _id: id,
    })
      .then((doc) => {
        // deleting from uploads
        fs.unlink(doc.p_image, (err) => {
          if (err) {
            console.log(err);
          } else {
            //updating from db by creating an update object
            const update = {
              p_name: req.body.p_name || doc.p_name,
              p_category: req.body.p_category || doc.p_category,
              p_subcategory: req.body.p_subcategory || doc.p_subcategory,
              p_quantity: req.body.p_quantity || doc.p_quantity,
              p_colors: req.body.p_colors || doc.p_colors,
              p_price: parseFloat(req.body.p_price) || doc.p_price,
              p_image: file.path,
              p_description: req.body.p_description || doc.p_description,
              p_shipping: req.body.p_shipping || doc.p_shipping,
              p_brand: req.body.p_brand || doc.p_brand,
              p_discount: req.body.p_discount || doc.p_discount,
            };
            //update db
            Products.updateOne(
              {
                _id: id,
              },
              update
            )
              .then((doc) => {
                res.json({
                  message: "product has been updated",
                });
              })
              .catch((error) => {
                res.json({
                  message: "Product not updated",
                });
              });
          }
        });
      })
      .catch((error) => {
        res.json({
          message: "Product not found",
        });
      });
  } else {
    // if no file
    Products.findById({
      _id: id,
    })
      .then((doc) => {
        //updating from db by creating an update object
        const update = {
          p_name: req.body.p_name || doc.p_name,
          p_category: req.body.p_category || doc.p_category,
          p_subcategory: req.body.p_subcategory || doc.p_subcategory,
          p_quantity: req.body.p_quantity || doc.p_quantity,
          p_colors: req.body.p_colors || doc.p_colors,
          p_price: parseFloat(req.body.p_price) || doc.p_price,
          p_image: doc.p_image,
          p_description: req.body.p_description || doc.p_description,
          p_shipping: req.body.p_shipping || doc.p_shipping,
          p_brand: req.body.p_brand || doc.p_brand,
          p_discount: req.body.p_discount || doc.p_discount,
        };
        //update db
        Products.updateOne(
          {
            _id: id,
          },
          update
        )
          .then((doc) => {
            res.json({
              message: "product has been updated",
            });
          })
          .catch((error) => {
            res.json({
              message: "Product not updated",
            });
          });
      })
      .catch((error) => {
        res.json({
          message: "Product not found",
        });
      });
    // return next();
  }
};
