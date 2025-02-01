const mongoose = require("mongoose");

const UserPackageSchema = new mongoose.Schema(
  {
    bookings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    ],
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    slots: { type: Number, default: 0 },
    totalSlots: { type: Number, default: 0 },
    price: { type: Number, required: true },
    uuid: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPackage", UserPackageSchema);
