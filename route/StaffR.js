const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const {
  createStaff,
  getAllStaffs,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require("../controller/StaffC.js");

// Routes
router.post("/staff/", authMiddleware, isAdmin, createStaff);
router.get("/staff/", getAllStaffs);
router.get("/staff/:id", authMiddleware, isAdmin, getStaffById);
router.put("/staff/:id", authMiddleware, isAdmin, updateStaff);
router.delete("/staff/:id", authMiddleware, isAdmin, deleteStaff);

module.exports = router;
