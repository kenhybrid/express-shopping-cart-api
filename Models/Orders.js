const mongoose = require("mongoose");

//creating a orders schema
const ordersSchema = new mongoose.Schema(
  {
    o_no: {
      type: Number,
    },
    o_status: {
      type: String,
      default: "pending",
      //   required: true,
    },
    o_products: {
      type: Array,
      required: true,
    },
    o_total: {
      type: Number,
      required: true,
    },
    o_paymentmethod: {
      type: String,
      required: true,
    },
    o_customername: {
      type: String,
      required: true,
    },
    o_customeremail: {
      type: String,
      required: true,
    },
    o_customerphone: {
      type: Number,
      required: true,
    },
    o_invoice: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", ordersSchema);
