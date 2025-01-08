const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const {
  createStaff,
  getAllStaffs,
  getStaffById,
  updateStaff,
  deleteStaff,
  getTotalStaffs,
} = require("../controller/StaffC.js");
const { upload } = require("../utils/uploadImg.js");

// Routes
router.post(
  "/staff/",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  createStaff
);
router.get("/staff/", getAllStaffs);
router.get("/getTotalStaffs", getTotalStaffs);
router.get("/staff/:id", authMiddleware, isAdmin, getStaffById);
router.put(
  "/staff/:id",
  upload.single("image"),
  authMiddleware,
  isAdmin,
  updateStaff
);
router.delete("/staff/:id", deleteStaff);

module.exports = router;
