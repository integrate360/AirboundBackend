const AsyncHandler = require("express-async-handler");
const Payment = require("../model/PaymentM");
const Booking = require("../model/BookingM");
const Class = require("../model/ClassM");
const User = require("../model/UserM");

// Create a payment
const createPayment = AsyncHandler(async (req, res) => {
  const { package, user, class: classId, amount, bookings } = req.body;

  // Validate required fields
  if (!user || !amount || !bookings) {
    throw new Error("booking, user, and amount are required");
  }

  // Validate references
  const classExists = await Class.findById(classId);
  if (!classExists) throw new Error("Class not found");

  const userExists = await User.findById(user);
  if (!userExists) throw new Error("User not found");

  // Create a payment
  const newPayment = await Payment.create({
    ...req.body,
    class: classId,
    package,
    user,
    amount,
  });

  // Create bookings
  try {
    const bookingPromises = bookings.map(async (book) => {
      // Validate booking object
      if (!book.dates || !book.time || !book.class) {
        throw new Error("Invalid booking data");
      }
      const newBooking = new Booking({ ...book });
      await newBooking.save();
      return newBooking;
    });

    const createdBookings = await Promise.all(bookingPromises);

    res.status(201).json({
      success: true,
      message: "Payment and bookings created successfully",
      data: {
        payment: newPayment,
        bookings: createdBookings,
      },
    });
  } catch (error) {
    throw new Error(`Error creating bookings: ${error.message}`);
  }
});

// Get all payments
const getAllPayments = AsyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("class")
    .populate("package") // Corrected path
    .populate({
      path: "package",
      populate: {
        path: "services",
      },
    })
    .populate("user"); // Corrected path

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
