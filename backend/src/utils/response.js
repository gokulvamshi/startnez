const successResponse = (res, data, statusCode = 200, message = null) => {
  const payload = {
    success: true,
    data
  };
  if (message) {
    payload.message = message;
  }
  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, code = 'ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      details
    }
  });
};

module.exports = {
  successResponse,
  errorResponse
};
