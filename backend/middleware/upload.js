import multer from "multer";

// Use memory storage (file won't be saved to disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

export default upload;
