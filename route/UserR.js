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
  resetPassword,
} = require("../controller/UserC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/user/login/", login);
router.post("/user/register/", register);
router.post("/user/forgotPassword/", forgotPassword);
router.post("/user/resetPassword/:resetToken/", resetPassword);
router.get("/user/logout/", authMiddleware, logout);
router.get("/users/", getAllUsers);
router.get("/totalUsers/", totalUsers);
router.get("/user/:id/", authMiddleware, getUser);
router.delete("/users/:id/", authMiddleware, isAdmin, deleteUser);

module.exports = router;
