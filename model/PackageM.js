const mongoose = require("mongoose");

var PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    services: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    ],
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    days: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
