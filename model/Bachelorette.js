const mongoose = require("mongoose");

const bacheloretteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    people: { type: Number },
    date: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bachelorette", bacheloretteSchema);
