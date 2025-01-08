
const multer = require('multer');
const storage = multer.memoryStorage(); 

export const upload = multer({ storage });

export const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed.', error: err.message });
    }
    next(); 
  });
};
