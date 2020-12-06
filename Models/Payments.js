const mongoose = require("mongoose");

//creating a payments schema
const paymentsSchema = new mongoose.Schema(
  {
    pay_method: {
      type: String,
      required: true,
    },
    pay_id: {
      type: String,
      required: true,
    },
    pay_total: {
      type: String,
      required: true,
    },
    pay_customeremail: {
      type: String,
      required: true,
    },
    pay_customerphone: {
      type: String,
      required: true,
    },
    pay_status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payments", paymentsSchema);
