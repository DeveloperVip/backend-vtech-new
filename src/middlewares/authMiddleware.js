const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('./errorHandler');
const { AdminUser, User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.role === 'editor') {
      const admin = await AdminUser.findByPk(decoded.id);
      if (!admin || !admin.isActive) {
        return next(new AppError('Admin account not found or disabled', StatusCodes.UNAUTHORIZED));
      }
      req.admin = admin;
    } else {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new AppError('User account not found', StatusCodes.UNAUTHORIZED));
      }
      req.user = user;
    }
    
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED));
  }
};

module.exports = { authMiddleware };
