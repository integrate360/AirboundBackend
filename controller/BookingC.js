const AsyncHandler = require("express-async-handler");
const Booking = require("../model/BookingM");
const Class = require("../model/ClassM");
const User = require("../model/UserM");

// Create a booking
const createBooking = AsyncHandler(async (req, res) => {
  const { class: classId, user: userId, dates, location } = req.body;

  // Validate required fields
  if (!classId || !userId || !dates || dates.length === 0) {
    throw new Error("Class, user, and dates are required");
  }

  // Validate references
  const classExists = await Class.findById(classId);
  if (!classExists) throw new Error("Class not found");

  const userExists = await User.findById(userId);
  if (!userExists) throw new Error("User not found");

  // Create a booking
  const newBooking = await Booking.create({
    class: classId,
    user: userId,
    dates,
    location,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: newBooking,
  });
});

// Get all bookings
const getAllBookings = AsyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user")
    .populate("class")
    .populate({
      path: "class",
      populate: {
        path: "trainers",
      },
    });

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

// Get a booking by ID
const getBookingById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const booking = await Booking.findById(id).populate(
    "class user",
    "name title"
  );

  if (!booking) throw new Error("Booking not found with this ID");

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    data: booking,
  });
});

// Update a booking by ID
const updateBooking = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("class user", "name title");

  if (!updatedBooking) throw new Error("Booking not found with this ID");

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: updatedBooking,
  });
});

// Delete a booking by ID
const deleteBooking = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  const deletedBooking = await Booking.findByIdAndDelete(id);

  if (!deletedBooking) throw new Error("Booking not found with this ID");

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: deletedBooking,
  });
});

const getBookingsByUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Please provide an ID");

  try {
    const bookings = await Booking.find({ user: id })
      .populate("class")
      .populate("user");
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
};
