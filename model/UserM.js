const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: { type: String },
    emergencyPhone: { type: String },
    medicalCondition: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
