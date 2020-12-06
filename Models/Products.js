const mongoose = require("mongoose");

//creating a products schema
const productSchema = new mongoose.Schema(
  {
    p_name: {
      type: String,
      required: true,
    },
    p_quantity: {
      type: Number,
      required: true,
    },
    p_price: {
      type: Number,
      required: true,
    },
    p_discount: {
      type: Number,
    },
    p_brand: {
      type: String,
      required: true,
    },
    p_colors: {
      type: Array,
      default: "black",
      //   required: true,
    },
    p_category: {
      type: String,
      required: true,
    },
    p_subcategory: {
      type: String,
    },
    p_description: {
      type: String,
      required: true,
    },
    p_image: {
      type: String,
      required: true,
    },
    p_shipping: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
