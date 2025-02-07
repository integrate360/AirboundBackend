const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", StaffSchema);
