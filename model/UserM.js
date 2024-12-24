const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
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
    emergencyPhone: { type: Number },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", UserSchema);
