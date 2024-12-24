const express = require("express");
const router = express.Router();
const {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
} = require("../controller/AdvertisementC.js");
const { upload } = require("../utils/uploadImg.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");

// Routes
router.post(
  "/ads",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  createAdvertisement
);
router.get("/ads", getAllAdvertisements);
router.get("/ads/:id", authMiddleware, isAdmin, getAdvertisementById);
router.put(
  "/ads/:id",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  updateAdvertisement
);
router.delete("/ads/:id", authMiddleware, isAdmin, deleteAdvertisement);

module.exports = router;
