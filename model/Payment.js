const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var PaymentSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    amount: {
      type: Number,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dates: [
      {
        type: Date,
      },
    ],
    amount: { type: Number },
    location: { type: String },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Payment", PaymentSchema);
