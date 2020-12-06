const mongoose = require("mongoose");

//creating a categories schema
const categorySchema = new mongoose.Schema(
  {
    c_name: {
      type: String,
      required: true,
    },
    c_subcategories: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
