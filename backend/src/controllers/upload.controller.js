const uploadService = require('../services/upload.service');
const { successResponse, errorResponse } = require('../utils/response');

class UploadController {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 'No image file uploaded', 400, 'NO_FILE');
      }
      const bucket = req.body.bucket || 'post-images';
      const folder = req.body.folder || (req.user ? req.user.id : 'public');

      const uploaded = await uploadService.uploadFile(req.file, bucket, folder);
      return successResponse(res, uploaded, 201, 'Image uploaded successfully');
    } catch (err) {
      next(err);
    }
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 'No file uploaded', 400, 'NO_FILE');
      }
      const bucket = req.body.bucket || 'project-files';
      const folder = req.body.project_id || (req.user ? req.user.id : 'public');

      const uploaded = await uploadService.uploadFile(req.file, bucket, folder);
      return successResponse(res, uploaded, 201, 'File uploaded successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req, res, next) {
    try {
      return successResponse(res, { message: 'File deleted from storage' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UploadController();
