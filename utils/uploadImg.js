const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public");
  },
  filename(req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = { upload };
