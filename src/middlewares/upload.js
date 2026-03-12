const path = require('path');
const fs = require('fs');
const multer = require('multer');

/**
 * Multer middleware для загрузки изображений объявлений.
 * Файлы сохраняются в /uploads/{userId}/
 * Требует, чтобы req.user был установлен (auth middleware должен выполняться до multer).
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.user) {
      return cb(new Error('Unauthorized'));
    }
    const userId = req.user._id.toString();
    const uploadPath = path.join(process.cwd(), 'uploads', userId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const baseName = path.basename(file.originalname, ext) || 'image';
    const safeName = `${baseName}-${Date.now()}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Допустимы только изображения: jpg, jpeg, png, gif, webp'));
    }
  },
});

/**
 * Middleware для загрузки массива изображений (поле "images").
 */
const uploadImages = upload.array('images', 10);

module.exports = {
  upload,
  uploadImages,
};
