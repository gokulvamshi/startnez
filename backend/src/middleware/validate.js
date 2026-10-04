const { ZodError } = require('zod');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;
      if (source === 'body') dataToValidate = req.body;
      else if (source === 'query') dataToValidate = req.query;
      else if (source === 'params') dataToValidate = req.params;
      else dataToValidate = req.body;

      const validatedData = schema.parse(dataToValidate);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors
          }
        });
      }
      next(error);
    }
  };
};

module.exports = { validate };
