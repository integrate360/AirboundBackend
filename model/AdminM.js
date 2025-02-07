const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const AdmminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
});

//Export the model
module.exports = mongoose.model("Admin", AdmminSchema);
