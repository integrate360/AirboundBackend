const AsyncHandler = require("express-async-handler");
const Payment = require("../model/PaymentM");
const Booking = require("../model/BookingM");
const Class = require("../model/ClassM");
const User = require("../model/UserM");
const { v4: uuid } = require("uuid");
const Razorpay = require("razorpay");
const moment = require("moment");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const { sendInvoiceToUser } = require("../helper/Invoice");
const PackageM = require("../model/PackageM");
const UserPackagesM = require("../model/UserPackagesM");

// Create a payment
// const createPayment = AsyncHandler(async (req, res) => {
//   const { package, user, class: classId, amount, bookings } = req.body;
//   console.log(req.body);
//   // Validate required fields
//   if (!user || !amount || !bookings) {
//     res.status(202).json("booking, user, and amount are required");
//   }

//   // Validate references
//   const classExists = await Class.findById(classId);
//   if (!classExists) res.status(202).json("Class not found");

//   const userExists = await User.findById(user);
//   if (!userExists) res.status(202).json("User not found");

//   // Create a payment
//   const newPayment = await Payment.create({
//     ...req.body,
//     class: classId,
//     package,
//     user,
//     amount,
//   });

//   // Create bookings
//   try {
//     const bookingPromises = bookings.map(async (book) => {
//       // Validate booking object
//       if (!book.dates || !book.time || !book.class) {
//         res.status(202).json("Invalid booking data");
//       }
//       const newBooking = new Booking({ ...book });
//       await newBooking.save();
//       return newBooking;
//     });

//     const createdBookings = await Promise.all(bookingPromises);

//     res.status(201).json({
//       success: true,
//       message: "Payment and bookings created successfully",
//       data: {
//         payment: newPayment,
//         bookings: createdBookings,
//       },
//     });
//   } catch (error) {
//     res.status(202).json(`Error creating bookings: ${error.message}`);
//   }
// });

const createPayment = AsyncHandler(async (req, res) => {
  const { user, class: classId, amount, bookings } = req.body;

  // Validate required fields
  if (!user || !amount || !bookings) {
    return res
      .status(400)
      .json({ message: "Booking, user, and amount are required" });
  }

  // Validate references
  const classExists = await Class.findById(classId);
  if (!classExists) {
    return res.status(404).json({ message: "Class not found" });
  }

  const userExists = await User.findById(user);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a payment
  const newPayment = await Payment.create({
    ...req.body,
    class: classId,
    user,
    amount,
  });

  // Create bookings and use aggregation to populate location
  try {
    const bookingPromises = bookings?.map(async (book) => {
      if (!book.dates || !book.time || !book.class) {
        throw new Error("Invalid booking data");
      }
      const newBooking = new Booking({ ...book });
      await newBooking.save();
      return newBooking;
    });

    const createdBookings = await Promise.all(bookingPromises);

    // Aggregation to populate location and other details in one query
    const populatedBookings = await Booking.aggregate([
      {
        $match: { _id: { $in: createdBookings.map((b) => b._id) } },
      },
      {
        $lookup: {
          from: "locations", // Lookup the locations collection
          localField: "location", // Join with the location field
          foreignField: "_id", // Match by _id in the Location collection
          as: "locationDetails", // Store matched locations in locationDetails
        },
      },
      {
        $unwind: {
          path: "$locationDetails",
          preserveNullAndEmptyArrays: true, // Allows empty location fields if not matched
        },
      },
      {
        $project: {
          _id: 1,
          className: 1,
          locationName: { $ifNull: ["$locationDetails.name", "N/A"] }, // If location is not found, set to "N/A"
          dates: 1,
          totalAmount: amount,
        },
      },
    ]);

    // Send invoice email to the user
    try {
      const locationNames =
        populatedBookings.map((booking) => booking.locationName).join(", ") ||
        "N/A"; // Join location names if multiple locations

      const bookingDetails = {
        _id: newPayment._id,
        className: classExists.name,
        location: locationNames, // Locations are now correctly populated and joined
        dates:
          populatedBookings[0]?.dates?.map((e) =>
            moment(e).format("MMM DD, YYYY")
          ) || [], // Assuming dates are in bookings
        isPackge: false,
        totalAmount: amount,
      };

      const userDetails = {
        name: userExists.name,
        email: userExists.email,
        phone: userExists?.phone,
      };

      console.log("Sending invoice email to user:", userDetails);
      await sendInvoiceToUser(userDetails, bookingDetails);
      console.log("Invoice email sent successfully");
    } catch (emailError) {
      console.error("Failed to send invoice email:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Payment and bookings created successfully",
      data: {
        payment: newPayment,
        bookings: createdBookings,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating bookings: ${error.message}` });
  }
});
const createPackagePayment = AsyncHandler(async (req, res) => {
  const { package, user, amount, bookings } = req.body;
  // Validate required fields
  if (!user || !amount || !bookings) {
    return res
      .status(400)
      .json({ message: "Booking, user, and amount are required" });
  }
  const UniqueId = uuid();

  // Validate references
  const classExists = await PackageM.findById(package);
  if (!classExists) {
    return res.status(404).json({ message: "Class not found" });
  }

  const userExists = await User.findById(user);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a payment
  const newPayment = await Payment.create({
    ...req.body,
    package,
    user,
    amount,
  });

  // Create bookings and use aggregation to populate location
  try {
    let bookingIds = []; //storing the booking id for userPackages
    const bookingPromises = bookings?.map(async (book) => {
      const newBooking = new Booking({
        ...book,
        user,
        class: book?.classId,
        dates: [book?.date],
        location: book?.location?._id,
        time: book?.time,
        duration: book?.classDuration,
        package,
        uuid: UniqueId,
      });
      await newBooking.save();
      bookingIds.push(newBooking?._id);
      return newBooking;
    });

    const createdBookings = await Promise.all(bookingPromises);

    // Create User Package History
    try {
      const userPackage = new UserPackagesM({
        uuid: UniqueId,
        bookings: bookingIds,
        package,
        price: amount,
        slots: bookingIds?.length,
        totalSlots: classExists?.days,
        user,
      });
      await userPackage.save();
    } catch (error) {
      console.log("Error Creating User Package" + error);
      return res.status(300).json({ message: error.message });
    }
    // Send invoice email to the user
    try {
      const bookingDetails = {
        _id: newPayment._id,
        className: classExists.name,
        location: "Multiple Locations", // Locations are now correctly populated and joined
        dates: ["Multiple Dates"] || [], // Assuming dates are in bookings
        totalAmount: amount,
        isPackge: true,
      };

      const userDetails = {
        name: userExists.name,
        email: userExists.email,
        phone: userExists?.phone,
      };

      console.log("Sending invoice email to user:", userDetails);
      await sendInvoiceToUser(userDetails, bookingDetails);
      console.log("Invoice email sent successfully");
    } catch (emailError) {
      console.error("Failed to send invoice email:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Payment and bookings created successfully",
      data: {
        payment: newPayment,
        bookings: createdBookings,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating bookings: ${error.message}` });
  }
});
// Get all payments
const getAllPayments = AsyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("class")
    .populate("package")
    .populate({
      path: "package",
      populate: {
        path: "services",
      },
    })
    .populate("user");

  res.status(200).json({
    success: true,
    message: "Payments fetched successfully",
    data: payments,
  });
});

const getPaymentById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Please provide an ID");
  }

  const payment = await Payment.findById(id)
    .populate("class")
    .populate({
      path: "package",
      populate: {
        path: "services",
      },
    })
    .populate("user");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found with this ID");
  }

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
const createRazorpayPayment = AsyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount, // Amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_${Math.random() * 1000}`,
    });

    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});
module.exports = {
  createPayment,
  createRazorpayPayment,
  getAllPayments,
  getPaymentById,
  createPackagePayment,
  updatePayment,
  deletePayment,
};
