const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/CategoryC.js");

// Routes
router.post("/category/", authMiddleware, isAdmin, createCategory);
router.get("/category/", getAllCategories);
router.get("/category/:id", authMiddleware, isAdmin, getCategoryById);
router.put("/category/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/category/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
