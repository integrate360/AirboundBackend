const { viewContact, adminLogin } = require("../controller/AdminC.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const { upload } = require("../utils/uploadImg.js");
// Admin routes
router.post("/login", adminLogin);
router.get("/view-contacts", authMiddleware, isAdmin, viewContact);

module.exports = router;
