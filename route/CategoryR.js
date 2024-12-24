const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/CategoryC.js");
const { upload } = require("../utils/uploadImg.js");

// Routes
router.post("/category/", upload.single("image"), createCategory);
router.get("/category/", getAllCategories);
router.get("/category/:id", authMiddleware, isAdmin, getCategoryById);
router.put("/category/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/category/:id", deleteCategory);

module.exports = router;
