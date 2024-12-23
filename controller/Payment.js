const AsyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Class = require("../models/Class");
const User = require("../models/User");

// Create a payment
const createPayment = AsyncHandler(async (req, res) => {
  const {
    class: classId,
    booking: bookingId,
    user: userId,
    dates,
    amount,
    location,
  } = req.body;

  // Validate required fields
  if (!classId || !bookingId || !userId || !amount) {
    throw new Error("Class, booking, user, and amount are required");
  }

  // Validate references
  const classExists = await Class.findById(classId);
  if (!classExists) throw new Error("Class not found");

  const bookingExists = await Booking.findById(bookingId);
  if (!bookingExists) throw new Error("Booking not found");

  const userExists = await User.findById(userId);
  if (!userExists) throw new Error("User not found");

  // Create a payment
  const newPayment = await Payment.create({
    class: classId,
    booking: bookingId,
    user: userId,
    dates,
    amount,
    location,
  });

  res.status(201).json({
    success: true,
    message: "Payment created successfully",
    data: newPayment,
  });
});

// Get all payments
const getAllPayments = AsyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("class booking user", "title name amount")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Payments fetched successfully",
    data: payments,
  });
});

// Get a payment by ID
const getPaymentById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const payment = await Payment.findById(id).populate(
    "class booking user",
    "title name amount"
  );

  if (!payment) throw new Error("Payment not found with this ID");

  res.status(200).json({
    success: true,
    message: "Payment fetched successfully",
    data: payment,
  });
});

// Update a payment by ID
const updatePayment = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("class booking user", "title name amount");

  if (!updatedPayment) throw new Error("Payment not found with this ID");

  res.status(200).json({
    success: true,
    message: "Payment updated successfully",
    data: updatedPayment,
  });
});

// Delete a payment by ID
const deletePayment = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const deletedPayment = await Payment.findByIdAndDelete(id);

  if (!deletedPayment) throw new Error("Payment not found with this ID");

  res.status(200).json({
    success: true,
    message: "Payment deleted successfully",
    data: deletedPayment,
  });
});

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
