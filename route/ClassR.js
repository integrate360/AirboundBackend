const {
  updateClass,
  deleteClass,
  getClassById,
  createClass,
  getClasses,
} = require("../controller/ClassC.js");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware.js");
const router = require("express").Router();
const { upload } = require("../utils/uploadImg.js");

router.post(
  "/class",
  // authMiddleware,
  // isAdmin,
  upload.array("images"),
  createClass
);

router.put(
  "/classes/:id",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  updateClass
);

router.get("/classes", getClasses);
router.get("/class/:id", getClassById);
router.delete("/class/:id", deleteClass);

module.exports = router;
