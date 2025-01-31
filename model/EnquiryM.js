const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    people: { type: Number },
    date: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
