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
    availability: [
      {
        day: {
          type: Number,
          required: true,
        },
        time: { type: String, required: true },
        duration: { type: Number, required: true },
        trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
        maxPeople: { type: Number },
        locations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
      },
    ],
    price: { type: Number, required: true },
    image: [{ type: String }],
    // locations: { type: [String] },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
