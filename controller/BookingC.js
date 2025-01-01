const AsyncHandler = require("express-async-handler");
const Booking = require("../model/BookingM");
const Class = require("../model/ClassM");
const User = require("../model/UserM");
const PaymentM = require("../model/PaymentM");

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
    ...req.body,
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
    .populate("trainer")
    .populate("class");
  // .populate({
  //   path: "class",
  //   populate: {
  //     path: "trainers",
  //   },
  // });

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const getTotalAmount = AsyncHandler(async (req, res) => {
  try {
    // Fetch all bookings
    const bookings = await PaymentM.find();

    // If bookings are empty
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
        data: 0,
      });
    }

    // Calculate total amount by summing up the 'amount' field
    const totalAmount = bookings.reduce(
      (sum, booking) => sum + (booking?.amount || 0),
      0
    );

    // Respond with total amount
    res.status(200).json({
      success: true,
      message: "Total amount fetched successfully",
      data: totalAmount,
    });
  } catch (error) {
    // Catch any errors and send the error message
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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

const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// GET /api/bookings/available-slots
const availableSlots = AsyncHandler(async (req, res) => {
  try {
    const {
      bookingId, // Current booking ID for rescheduling
      startDate, // Starting date to check availability
      endDate, // Ending date to check availability
    } = req.query;

    // Get current booking details
    const booking = await Booking.findById(bookingId)
      .populate("class")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Get all dates between start and end
    const datesToCheck = getDatesBetween(
      new Date(startDate),
      new Date(endDate)
    );

    // Get all bookings for this class in the date range
    const existingBookings = await Booking.find({
      class: booking.class._id,
      dates: {
        $elemMatch: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
      time: booking.time,
    });

    // Calculate available slots
    const availableSlots = datesToCheck.map((date) => {
      // Check if it's an available weekday
      const isAvailableDay = booking.class.availability.includes(date.getDay());

      // Count bookings for this date
      const bookingsOnDate = existingBookings.filter(
        (b) => b.dates[0].toDateString() === date.toDateString()
      ).length;

      // Check if slot is at least 3 hours away
      const slotDateTime = new Date(date);
      const [hours, minutes] = booking.time.split(":");
      slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const threeHoursFromNow = new Date();
      threeHoursFromNow.setHours(threeHoursFromNow.getHours() + 3);

      // Calculate if slot is available
      const isAvailable =
        isAvailableDay &&
        bookingsOnDate < booking.class.maxPeople &&
        slotDateTime > threeHoursFromNow;

      return {
        date: date.toISOString(),
        available: isAvailable,
        remainingSlots: booking.class.maxPeople - bookingsOnDate,
      };
    });

    res.json({
      bookingDetails: {
        packageDuration: booking.pacakge.duration,
        time: booking.time,
        originalDate: booking.dates[0],
      },
      availableSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Error fetching available slots" });
  }
});

// PUT /api/bookings/reschedule
const reschedule = AsyncHandler(async (req, res) => {
  try {
    const { newDate, date } = req.body;
    const { id } = req.params;

    console.log(newDate, date, id);
    // Validate new date is available
    const booking = await Booking.findById(id).populate("class");
    console.log(booking.dates.indexOf(date));
    console.log(date, booking.dates);
    if (booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking
    booking.dates = [new Date(newDate)];
    await booking.save();

    res.json({
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    res.status(201).json({ message: error.message });
  }
});
module.exports = {
  getTotalAmount,
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
  reschedule,
  availableSlots,
};
