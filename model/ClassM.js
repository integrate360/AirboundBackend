const mongoose = require("mongoose");
var ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: {
      type: String,
      required: true,
    },
    availability: {
      type: [Number],
      required: true,
    },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    //TODO the Trainers
    trainers: {},
    image: { type: String },
    maxPeople: { type: Number },
    locations: { type: [String] },
    packages: [
      {
        days: { type: Number },
        duration: { type: Number },
        amount: { type: Number },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
