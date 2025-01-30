const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    numberOfPeople: { type: Number },
    date: { type: Date },
    location : { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
