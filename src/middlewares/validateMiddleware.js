const { StatusCodes } = require('http-status-codes');

/**
 * Generic validation middleware factory using Joi schemas
 * @param {Object} schema - Joi schema object
 * @param {'body'|'query'|'params'} target - request property to validate
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,     // return all errors, not just the first
      stripUnknown: true,    // remove unknown fields
      convert: true,         // type coercion (trim, etc.)
    });

    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        const field = detail.path.join('.');
        acc[field] = detail.message;
        return acc;
      }, {});

      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    req[target] = value;
    next();
  };
};

module.exports = { validate };
