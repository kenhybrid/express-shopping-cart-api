const mongoose = require("mongoose");

//creating a UI schema
const uiSchema = new mongoose.Schema(
  {
    ui_title: {
      type: String,
      required: true,
    },
    ui_subtitle: {
      type: String,
      required: true,
    },
    ui_category: {
      type: String,
      required: true,
    },
    ui_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ui", uiSchema);
