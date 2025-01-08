const express = require("express");
const {
  createEnquiry,
  getEnquiries,
  deleteEnquiry,
} = require("../controller/EnquiryC");

const router = express.Router();

// Routes for enquiries
router.post("/", createEnquiry); // Create an enquiry
router.get("/", getEnquiries); // Get all enquiries
router.delete("/:id", deleteEnquiry); // Delete an enquiry

module.exports = router;
