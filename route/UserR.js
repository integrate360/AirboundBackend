const express = require("express");
const {
  login,
  register,
  getAllUsers,
  deleteUser,
  logout,
  getUser,
  totalUsers,
} = require("../controller/UserC");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/user/login/", login);
router.post("/user/register/", register);
router.get("/user/logout/", authMiddleware, logout);
router.get("/users/", getAllUsers);
router.get("/totalUsers/", totalUsers);
router.get("/user/:id/", authMiddleware, getUser);
router.delete("/users/:id/", authMiddleware, isAdmin, deleteUser);

module.exports = router;
