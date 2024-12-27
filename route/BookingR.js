const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
  getTotalAmount,
  availableSlots,
  reschedule,
} = require("../controller/BookingC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/booking/", authMiddleware, createBooking);
router.get("/bookings/", authMiddleware, isAdmin, getAllBookings);
router.get("/getTotalAmount", getTotalAmount);
router.get("/booking/:id", getBookingById);
router.get("/booking/user/:id", getBookingsByUser);
router.get("/bookings/available-slots", availableSlots);
router.put("/booking/reschedule", authMiddleware, reschedule);
router.put("/booking/:id", authMiddleware, isAdmin, updateBooking);
router.delete("/booking/:id", authMiddleware, isAdmin, deleteBooking);


module.exports = router;
