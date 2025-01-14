const express = require("express");
const {
  login,
  register,
  getAllUsers,
  deleteUser,
  logout,
  getUser,
  totalUsers,
  forgotPassword,
  changePassword,
  resetPassword,
  sendPushNotification,
  updateUser,
  generatePasswordController,
  genrateForgotOtp,
} = require("../controller/UserC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/user/login/", login);
router.post("/user/register/", upload.single("image"), register);
router.post("/user/forgot/", generatePasswordController);
router.post("/user/forgot/otp", genrateForgotOtp);
router.post("/user/forgot/password", forgotPassword);
router.post("/user/change/", changePassword);
router.post("/user/resetPassword/:resetToken/", resetPassword);
router.get("/user/logout/", authMiddleware, logout);
router.get("/users/", getAllUsers);
router.post("/send/:userId", sendPushNotification);
router.get("/totalUsers/", totalUsers);
router.get("/user/:id/", authMiddleware, getUser);
router.put("/user/:id/", authMiddleware, upload.single("image"), updateUser);
router.delete("/users/:id/", authMiddleware, isAdmin, deleteUser);

module.exports = router;
