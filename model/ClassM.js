const mongoose = require("mongoose");
var ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
    description: {
      type: String,
      required: true,
    },
    availability: [
      {
        type: Number,
        required: true,
      },
    ],
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    image: [{ type: String }],
    maxPeople: { type: Number },
    // locations: { type: [String] },
  
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
