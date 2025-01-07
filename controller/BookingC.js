const AsyncHandler = require("express-async-handler");
const Booking = require("../model/BookingM");
const Class = require("../model/ClassM");
const User = require("../model/UserM");
const moment = require("moment");
const PaymentM = require("../model/PaymentM");
const cron = require("node-cron");
const Notification = require("../model/Notifications");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.Sendgrid_Key);

// Utility: Send notification to users
const sendNotification = async (user, message) => {
  try {
    const notification = new Notification({
      userId: user._id,
      message,
      subject: "Class Start Reminder",
    });

    await notification.save();
    console.log(`Notification sent to ${user.email}: ${message}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Notify users of upcoming classes
const notifyUpcomingClasses = AsyncHandler(async () => {
  const currentDateTime = moment();
  const currentTime = currentDateTime.add(1, "minutes").format("HH:mm"); // Format time as HH:mm
  const currentDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z"; // Format date as YYYY-MM-DD

  console.log(`Current Time: ${currentTime}, Current Date: ${currentDate}`);

  try {
    // Aggregate to find bookings with classes starting within the next 2 minutes
    const upcomingBookings = await Booking.aggregate([
      {
        $match: {
          // Match bookings where any date in the 'dates' array is greater than or equal to the current date
          dates: {
            $elemMatch: {
              $gte: currentDate, // Match dates greater than or equal to current date
            },
          },
          time: currentTime, // Match the time exactly
        },
      },
      {
        $lookup: {
          from: "users", // Assuming the user collection is named "users"
          localField: "user", // "user" is the reference field in the Booking model
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the userDetails array to get a single object
      },
      {
        $lookup: {
          from: "classes", // Assuming the class collection is named "classes"
          localField: "class", // "class" is the reference field in the Booking model
          foreignField: "_id",
          as: "classDetails",
        },
      },
      {
        $unwind: "$classDetails", // Unwind the classDetails array to get a single object
      },
      {
        $project: {
          "userDetails.email": 1,
          "userDetails._id": 1,
          "classDetails.name": 1,
        },
      },
    ]);

    if (!upcomingBookings || upcomingBookings.length === 0) {
      console.log("No upcoming classes in the next 2 minutes.");
      return;
    }

    // Notify users
    upcomingBookings.forEach((booking) => {
      const message = `Your class "${booking.classDetails.name}" is starting in less than 2 minutes. Please be prepared.`;
      console.log(
        `Notifying user ${booking.userDetails.email} about class "${booking.classDetails.name}"`
      );
      sendNotification(booking.userDetails, message);
    });

    console.log(
      `Notifications sent for ${upcomingBookings.length} upcoming classes.`
    );
  } catch (error) {
    console.error(
      "Error finding upcoming bookings or sending notifications:",
      error
    );
  }
});

// Schedule the task to run every minute
cron.schedule("* * * * *", () => {
  console.log("Running a task every minute to check for upcoming classes...");
  notifyUpcomingClasses();
});

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
    .populate("class")
    .populate("location");
  // .populate({
  //   path: "class",
  //   populate: {
  //     path: "locations",
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
      .populate("trainer")
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

const reschedule = AsyncHandler(async (req, res) => {
  try {
    const { newDate, date } = req.body;
    const { id } = req.params;

    // Validate booking with aggregation
    const booking = await Booking.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "classes", // Replace "classes" with your actual collection name
          localField: "class",
          foreignField: "_id",
          as: "classDetails",
        },
      },
      {
        $unwind: "$classDetails",
      },
    ]);

    if (!booking || booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingData = booking[0];
    const formattedDate = new Date(date).toISOString();

    // Ensure the date exists in the booking
    const index = bookingData.dates.findIndex(
      (d) => new Date(d).toISOString() === formattedDate
    );

    if (index === -1) {
      return res
        .status(400)
        .json({ message: "Original date not found in booking" });
    }

    // Update the date
    bookingData.dates.splice(index, 1, new Date(newDate));
    await Booking.findByIdAndUpdate(
      id,
      { dates: bookingData.dates },
      { new: true }
    );

    const user = await User.findById(bookingData.user).select("name email");
    if (user && user.email) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 24px;">
            <strong>Booking Rescheduled Successfully</strong>
          </div>
          <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
            Hello ${user.name},
          </p>
          <p style="font-size: 16px; color: #555; text-align: center;">
            Your booking for the class <strong>${
              bookingData.classDetails.name
            }</strong> has been successfully rescheduled.
          </p>
          <p style="font-size: 16px; color: #555; text-align: center;">
            <strong>New Date:</strong> ${new Date(newDate).toDateString()}
          </p>
          <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
            Thank you for choosing our services!
          </p>
        </div>
      `;

      try {
        // Send email using SendGrid
        const response = await sgMail.send({
          to: user.email,
          from: "airboundfitness@gmail.com", // Ensure this is verified in SendGrid
          subject: "Booking Rescheduled Successfully",
          html: emailContent,
        });

        console.log("Email sent successfully:", response);
      } catch (emailError) {
        console.error(
          "Failed to send email:",
          emailError.response?.body || emailError.message
        );

        if (emailError.response?.body?.errors) {
          emailError.response.body.errors.forEach((error) => {
            console.error("Email error detail:", error);
          });
        }
      }
    }

    res.json({
      message: "Booking rescheduled successfully",
      booking: bookingData,
    });
  } catch (error) {
    console.error("Error in reschedule function:", error.message);
    res.status(500).json({ message: error.message });
  }
});

const showAvailability = async (req, res) => {
  try {
    const { classId, date } = req.body;
    const localDate = moment(date, "DD-MM-YYYY").toISOString();
    // Validate input
    if (!classId || !date) {
      return res
        .status(400)
        .json({ message: "classId and date are required." });
    }

    // Fetch class details
    const classes = await Class.findById(classId).populate({
      path: "availability",
      populate: [
        { path: "trainers", model: "Staff" },
        { path: "locations", model: "Location" },
      ],
    });
    if (!classes) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Get availability slots for the given day
    const day = moment(date, "DD-MM-YYYY").day();
    const daySlots = classes.availability.filter((slot) => {
      return slot?.day === day;
    });

    // Fetch bookings for the class on the given date
    const bookings = await Booking.find({ class: classId });
    const formattedBookings = bookings.filter((booking) =>
      booking.dates.some((dbDate) => {
        const adjustedDate = moment(dbDate).utcOffset(330).format("DD-MM-YYYY"); // Adjusting to IST (UTC+5:30)
        console.log(adjustedDate, date);
        return adjustedDate === date;
      })
    );
    console.log(
      bookings.length,
      formattedBookings?.length,
      formattedBookings[0]?.dates,
      localDate,
      date
    );
    // Update the slots with the current number of people booked
    const updatedSlots = daySlots?.map((slot) => {
      const slotBookings = formattedBookings.filter(
        (booking) => booking.time === slot?.time
      );
      return {
        day: slot?.day,
        time: slot?.time,
        duration: slot?.duration,
        maxPeople: slot?.maxPeople,
        locations: slot?.locations,
        trainers: slot?.trainers,
        _id: slot?.trainers,
        people: slotBookings.length,
      };
    });

    res.status(200).json({
      available: true,
      slots: updatedSlots,
    });
  } catch (error) {
    console.error("Error showing availability:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

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
  showAvailability,
};
