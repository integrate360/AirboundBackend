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
  showAvailability,
} = require("../controller/BookingC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/booking/", authMiddleware, createBooking);
router.get("/bookings/", authMiddleware, isAdmin, getAllBookings);
router.get("/getTotalAmount", authMiddleware, isAdmin, getTotalAmount);
router.get("/booking/:id", authMiddleware, getBookingById);
router.post("/booking/availability", showAvailability);
router.get("/booking/user/:id", authMiddleware, getBookingsByUser);
router.get("/bookings/available-slots", availableSlots);
router.put("/booking/reschedule/:id", authMiddleware, reschedule);
router.put("/booking/:id", authMiddleware, isAdmin, updateBooking);
router.delete("/booking/:id", authMiddleware, isAdmin, deleteBooking);

module.exports = router;
