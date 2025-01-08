const {
  updateClass,
  deleteClass,
  getClassById,
  createClass,
  getClasses,
  getTotalClasses,
} = require("../controller/ClassC.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/class",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  createClass
);

router.put(
  "/class/:id",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  updateClass
);

router.get("/classes", getClasses);
router.get("/class/:id", getClassById);
router.delete("/class/:id", deleteClass);
router.get("/totalClasses", getTotalClasses);

module.exports = router;
