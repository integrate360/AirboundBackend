const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
} = require("../controller/AdvertisementC.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const { upload } = require("../utils/uploadImg.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");

// Advertisement Routes
router.post(
  "/ads",
  upload.single("image"), // Middleware to handle image upload
  createAdvertisement // Controller to handle advertisement creation
);

router.get(
  "/ads", // Optional: Require authentication for listing ads
  getAllAdvertisements // Controller to fetch all advertisements
);

router.get(
  "/ads/:id",
  authMiddleware, // Ensure user is authenticated
  isAdmin, // Ensure user is an admin
  getAdvertisementById // Controller to fetch a single advertisement by ID
);

router.put(
  "/ads/:id",
  authMiddleware, // Middleware for authentication
  isAdmin, // Middleware to ensure user is an admin
  upload.single("image"), // Handle image upload if the advertisement image is updated
  updateAdvertisement // Controller to handle advertisement updates
);

router.delete(
  "/ads/:id",
  authMiddleware, // Ensure user is authenticated
  isAdmin, // Ensure user is an admin
  deleteAdvertisement // Controller to handle advertisement deletion
);

module.exports = router;
