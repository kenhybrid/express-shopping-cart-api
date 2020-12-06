const Brands = require("../Models/Brands");
const fs = require("fs");
const { URL } = require("../Config");

//create a brand
exports.create = (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.json({
      error: "upload a file",
    });
    return next();
  }
  const brand = new Brands({
    b_name: req.body.b_name,
    b_description: req.body.b_description,
    b_image: file.path,
  });
  brand
    .save()
    .then((doc) => {
      res.json({
        message: "Brand was created",
        doc,
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to create a Brand ",
      });
    });
};

//get all brand components
exports.all = (req, res) => {
  Brands.find({})
    .then((doc) => {
      if (doc < 1) {
        return res.json({
          message: "No Brands were found",
        });
      }
      const count = doc.length;
      res.json({
        count,
        doc,
        URL,
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch Brands ",
      });
    });
};

//get one brand
exports.one = (req, res) => {
  const id = req.params.brandId;
  Brands.findById({
    _id: id,
  })
    .then((doc) => {
      if (doc < 1) {
        return res.json({
          error: "No Brand found",
        });
      }

      res.json({
        doc,
        URL,
      });
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch Brand ",
      });
    });
};

//delete a brand
exports.delete = (req, res) => {
  const id = req.params.brandId;

  Brands.findById({
    _id: id,
  }).then((doc) => {
    // deleting from uploads
    fs.unlink(doc.b_image, (err) => {
      if (err) {
        // console.log(err);
        return res.json({
          error: err,
        });
      }
      //deleting from db
      Brands.deleteOne({
        _id: id,
      })
        .then(() => {
          res.json({
            message: "Brand  is deleted",
          });
        })
        .catch((err) => {
          res.json({
            error: "Brand was not deleted",
          });
        });
    });
  });
};

//update a brand
exports.update = (req, res, next) => {
  //get id and file
  const id = req.params.brandId;
  const file = req.file;
  // check if file is present
  if (file) {
    Brands.findById({
      _id: id,
    })
      .then((doc) => {
        // deleting from uploads
        fs.unlink(doc.b_image, (err) => {
          if (err) {
            return console.log(err);
          } else {
            //updating from db by creating an update object
            const update = {
              b_name: req.body.b_name || doc.b_name,
              b_description: req.body.b_category || doc.b_description,
              b_image: file.path,
            };
            //update db
            Brands.updateOne(
              {
                _id: id,
              },
              update
            )
              .then((doc) => {
                res.json({
                  message: "Brand  has been updated",
                });
              })
              .catch((error) => {
                res.json({
                  message: "Brand  was not updated",
                });
              });
          }
        });
      })
      .catch((error) => {
        res.json({
          message: "Brands  was not found",
        });
      });
  } else {
    // if no file
    Brands.findById({
      _id: id,
    })
      .then((doc) => {
        //updating from db by creating an update object
        const update = {
          b_name: req.body.b_name || doc.b_name,
          b_description: req.body.b_category || doc.b_description,
          b_image: doc.b_image,
        };
        //update db
        Brands.updateOne(
          {
            _id: id,
          },
          update
        )
          .then((doc) => {
            res.json({
              message: "Brand  has been updated",
            });
          })
          .catch((error) => {
            res.json({
              message: "Brand  was not updated",
            });
          });
      })
      .catch((error) => {
        res.json({
          message: "Brand  not found",
        });
      });
    // return next();
  }
};
