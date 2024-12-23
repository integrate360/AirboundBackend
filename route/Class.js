const {
  updateClass,
  deleteClass,
  getClassById,
  createClass,
  getClasses,
} = require("../controller/Class.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const { upload } = require("../utils/uploadImg.js");

router.post(
  "/class",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  createClass
);

router.put(
  "/classes",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  updateClass
);

router.get("/classes", getClasses);
router.get("/class/:id", getClassById);
router.delete("/classes", authMiddleware, isAdmin, deleteClass);

module.exports = router;
