const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: { type: String },
    deviceToken: { type: String },
    token: { type: String },
    emergencyPhone: { type: String },
    medicalCondition: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
