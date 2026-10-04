const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10) // 50MB
  }
});

router.post('/image', authMiddleware, upload.single('image'), uploadController.uploadImage);
router.post('/file', authMiddleware, upload.single('file'), uploadController.uploadFile);
router.delete('/', authMiddleware, uploadController.deleteFile);

module.exports = router;
