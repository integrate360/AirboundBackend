const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const  BookingSchema = new mongoose.Schema(
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
    location: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
        ],
    amount: { type: Number },
    people: { type: Number, default: 1 },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Booking", BookingSchema);
