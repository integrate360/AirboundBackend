const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var BookingSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    time: { type: String },
    duration: { type: Number },
    dates: [
      {
        type: Date,
      },
    ],
    location: { type: String },
    amount: { type: Number },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Booking", BookingSchema);
