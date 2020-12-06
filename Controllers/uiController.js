const Ui = require("../Models/Ui");
const fs = require("fs");
const {
  URL
} = require("../Config");

//create a ui component
exports.create = (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.json({
      message: "upload a file"
    });
    return next();
  }
  const ui = new Ui({
    ui_title: req.body.ui_title,
    ui_subtitle: req.body.ui_subtitle,
    ui_category: req.body.ui_category,
    ui_image: file.path,
  });
  ui.save()
    .then((doc) => {
      res.json({
        message: "Ui created",
        doc
      });
    })
    .catch((error) => {
      res.json({
        error: "Could not create Ui component",
      });
    });
};

//get all ui components
exports.all = (req, res) => {
  Ui.find({})
    .then((doc) => {
      if (doc < 1) {
        res.json({
          message: "No Ui was found"
        });
      } else {
        const count = doc.length;
        res.json({
          count,
          doc,
          URL
        });
      }
    })
    .catch((error) => {
      res.json({
        error: "Failed to fetch Ui components"
      });
    });
};

//get one ui component
exports.one = (req, res) => {
  const id = req.params.uiId;

  Ui.findById({
      _id: id
    })
    .then((doc) => {
      res.status(200).json({
        doc,
        URL
      });
    })
    .catch((error) => {
      res.status(404).json({
        error: "No Ui component found"
      });
    });
};

//delete a ui component
exports.delete = (req, res) => {
  const id = req.params.uiId;

  Ui.findById({
    _id: id
  }).then((doc) => {
    // deleting from uploads
    fs.unlink(doc.ui_image, (err) => {
      if (err) {
        console.log(err);
      } else {
        //deleting from db
        Ui.deleteOne({
            _id: id
          })
          .then(() => {
            res.json({
              message: "Ui component is deleted"
            });
          })
          .catch((err) => {
            res.json({
              message: "Ui component not deleted"
            });
          });
      }
    });
  });
};

//update a ui component
exports.update = (req, res, next) => {
  //get id and file
  const id = req.params.uiId;
  const file = req.file;
  // check if file is present
  if (file) {
    Ui.findById({
        _id: id
      })
      .then((doc) => {
        // deleting from uploads
        fs.unlink(doc.ui_image, (err) => {
          if (err) {
            return console.log(err);
          } else {
            //updating from db by creating an update object
            const update = {
              ui_title: req.body.ui_title || doc.ui_title,
              ui_subtitle: req.body.ui_subtitle || doc.ui_subtitle,
              ui_category: req.body.ui_category || doc.ui_category,
              ui_image: file.path,
            };
            //update db
            Ui.updateOne({
                _id: id
              }, update)
              .then((doc) => {
                res
                  .status(201)
                  .json({
                    message: "Ui component has been updated"
                  });
              })
              .catch((error) => {
                res.json({
                  message: "Ui component was not updated"
                });
              });
          }
        });
      })
      .catch((error) => {
        res.status(404).json({
          message: "Ui component was not found"
        });
      });
  } else {
    // if no file
    Ui.findById({
        _id: id
      })
      .then((doc) => {
        //updating from db by creating an update object
        const update = {
          ui_title: req.body.ui_title || doc.ui_title,
          ui_subtitle: req.body.ui_subtitle || doc.ui_subtitle,
          ui_category: req.body.ui_category || doc.ui_category,
          ui_image: doc.ui_image,
        };
        //update db
        Ui.updateOne({
            _id: id
          }, update)
          .then((doc) => {
            res.status(201).json({
              message: "Ui component has been updated"
            });
          })
          .catch((error) => {
            res.status(404).json({
              message: "Ui component was not updated"
            });
          });
      })
      .catch((error) => {
        res.status(404).json({
          message: "Ui component not found"
        });
      });
    // return next();
  }
};