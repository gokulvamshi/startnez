const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  // Operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details
      }
    });
  }

  // Multer error handling
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: {
        message: `File upload error: ${err.message}`,
        code: 'FILE_UPLOAD_ERROR'
      }
    });
  }

  // Unhandled internal errors
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected internal error occurred' 
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
};

module.exports = { errorHandler };
