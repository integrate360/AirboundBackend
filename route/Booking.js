const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controller/Booking");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/booking/", authMiddleware, createBooking);
router.get("/booking/", authMiddleware, isAdmin, getAllBookings);
router.get("/booking/:id", getBookingById);
router.put("/booking/:id", authMiddleware, isAdmin, updateBooking);
router.delete("/booking/:id", authMiddleware, isAdmin, deleteBooking);

module.exports = router;
