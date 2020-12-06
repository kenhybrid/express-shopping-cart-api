const mongoose = require("mongoose");

//creating a users schema
const usersSchema = new mongoose.Schema(
  {
    u_firstname: {
      type: String,
      required: true,
    },
    u_secondname: {
      type: String,
      required: true,
    },
    u_email: {
      type: String,
      required: true,
      unique: true,
    },
    u_phone: {
      type: Number,
      required: true,
    },
    u_password: {
      type: String,
      required: true,
      min: 4,
      max: 1024,
    },
    u_roles: {
      type: String,
      default: "client",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);
