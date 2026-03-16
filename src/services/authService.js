const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');

const login = async (email, password) => {
  const admin = await AdminUser.findOne({ where: { email, isActive: true } });
  if (!admin) throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);

  await admin.update({ lastLoginAt: new Date() });

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  };
};

const createAdmin = async ({ name, email, password, role = 'admin' }) => {
  const exists = await AdminUser.findOne({ where: { email } });
  if (exists) throw new AppError('Email already in use', StatusCodes.CONFLICT);

  const hashed = await bcrypt.hash(password, 12);
  return AdminUser.create({ name, email, password: hashed, role });
};

module.exports = { login, createAdmin };
