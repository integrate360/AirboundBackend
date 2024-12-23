const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controller/Booking");

// Routes
router.post("/booking/", createBooking);
router.get("/booking/", getAllBookings);
router.get("/booking/:id", getBookingById);
router.put("/booking/:id", updateBooking);
router.delete("/booking/:id", deleteBooking);

module.exports = router;
