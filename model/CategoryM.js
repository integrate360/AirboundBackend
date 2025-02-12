const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Category", CategorySchema);
