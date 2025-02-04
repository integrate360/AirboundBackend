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
  sendNotificationToUsers,
  createMultipleBookings,
} = require("../controller/BookingC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/booking/", authMiddleware, createBooking);
router.post("/booking/multiple", authMiddleware, createMultipleBookings);
router.get("/bookings/", getAllBookings);
router.get("/getTotalAmount", authMiddleware, isAdmin, getTotalAmount);
router.get("/booking/:id", authMiddleware, getBookingById);
router.get("/booking/user/:id", authMiddleware, getBookingsByUser);
router.get("/bookings/available-slots", availableSlots);
router.put("/booking/reschedule/:id", authMiddleware, reschedule);
router.post("/booking/availability/", showAvailability);
router.put(
  "/booking/class/reschedule",
  authMiddleware,
  // isAdmin,
  sendNotificationToUsers
);
router.put("/booking/:id", authMiddleware, isAdmin, updateBooking);
router.delete("/booking/:id", authMiddleware, isAdmin, deleteBooking);

module.exports = router;
