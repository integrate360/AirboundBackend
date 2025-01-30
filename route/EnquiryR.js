const express = require("express");
const {
  createEnquiry,
  getEnquiries,
  deleteEnquiry,
  getEnquiryById,
} = require("../controller/EnquiryC");

const router = express.Router();

// Routes for enquiries
router.post("/enquiry", createEnquiry); 
router.get("/enquiry", getEnquiries); 
router.get("/getEnquiryById/:id", getEnquiryById); 
router.delete("/enquiry/:id", deleteEnquiry); 


module.exports = router;
