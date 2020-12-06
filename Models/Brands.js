const mongoose = require("mongoose");

//creating a brands schema
const brandsSchema = new mongoose.Schema(
  {
    b_name: {
      type: String,
      required: true,
    },
    b_image: {
      type: String,
      required: true,
    },
    b_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brands", brandsSchema);
