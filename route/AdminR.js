const { adminLogin, registerAdmin } = require("../controller/AdminC.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const { upload } = require("../utils/uploadImg.js");
// Admin routes
router.post("/admin/login", adminLogin);
router.post("/admin/register", registerAdmin);

module.exports = router;
