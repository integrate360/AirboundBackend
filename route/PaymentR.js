const express = require("express");
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controller/PaymentC");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");

// Routes
router.post("/payment/", createPayment);
router.get("/payment/", authMiddleware, isAdmin, getAllPayments);
router.get("/payment/:id", getPaymentById);
router.put("/payment/:id", authMiddleware, isAdmin, updatePayment);
router.delete("/payment/:id", authMiddleware, isAdmin, deletePayment);

module.exports = router;
