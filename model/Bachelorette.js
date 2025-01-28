const mongoose = require("mongoose");

const bacheloretteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bachelorette", bacheloretteSchema);
