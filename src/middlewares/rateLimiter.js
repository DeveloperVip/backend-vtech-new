const rateLimit = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 2000, // Increased to 2000 to support intensive search-as-you-type testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

// Strict limiter for form submission endpoints
const formSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You have submitted too many contact forms. Please try again in an hour.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

module.exports = { apiLimiter, formSubmitLimiter };
