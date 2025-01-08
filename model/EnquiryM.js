const mongoose = require("mongoose");
var EnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
