const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const {
  getAllPackages,
  getPackageById,
  getPackageByUserId,
} = require("../controller/UserPackageC");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/user-package", authMiddleware, isAdmin, getAllPackages);
router.get("/user-package/:id", authMiddleware, getPackageById);
router.get("/user-package/user/:id/", authMiddleware, getPackageByUserId);

module.exports = router;
