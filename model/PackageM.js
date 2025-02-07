const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    services: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    days: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
