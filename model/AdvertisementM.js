const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var AdvertisementSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    name: {
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
module.exports = mongoose.model("Advertisement", AdvertisementSchema);
