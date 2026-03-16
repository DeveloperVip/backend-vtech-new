const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('./errorHandler');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return next(new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED));
  }
};

module.exports = { authMiddleware };
