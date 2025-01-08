const express = require("express");
const {
  createEnquiry,
  getEnquiries,
  deleteEnquiry,
} = require("../controller/EnquiryC");

const router = express.Router();

// Routes for enquiries
router.post("/enquiry", createEnquiry); // Create an enquiry
router.get("/enquiry", getEnquiries); // Get all enquiries
router.delete("/enquiry/:id", deleteEnquiry); // Delete an enquiry

module.exports = router;
