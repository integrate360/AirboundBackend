const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const PaymentSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    isPackage: { type: Boolean, required: true },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Payment", PaymentSchema);
