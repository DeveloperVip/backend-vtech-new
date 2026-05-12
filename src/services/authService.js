const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const { sendPasswordResetEmail } = require('./emailService');

const RESET_TOKEN_EXPIRES_IN = '15m';

const buildResetUrl = (type, token) => {
  const clientUrl = process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:3000';
  return `${clientUrl.replace(/\/$/, '')}/reset-password?type=${type}&token=${encodeURIComponent(token)}`;
};

const signResetToken = (accountType, account) => jwt.sign(
  {
    purpose: 'password-reset',
    accountType,
    id: account.id,
    passwordVersion: new Date(account.updatedAt).getTime(),
  },
  process.env.JWT_SECRET,
  { expiresIn: RESET_TOKEN_EXPIRES_IN },
);

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

const updateProfile = async (admin, { name, email }) => {
  const nextName = String(name || '').trim();
  const nextEmail = String(email || '').trim().toLowerCase();

  if (!nextName || !nextEmail) {
    throw new AppError('Tên và email là bắt buộc', StatusCodes.BAD_REQUEST);
  }

  const exists = await AdminUser.findOne({
    where: {
      email: nextEmail,
      id: { [Op.ne]: admin.id },
    },
  });

  if (exists) throw new AppError('Email đã được sử dụng', StatusCodes.CONFLICT);

  await admin.update({ name: nextName, email: nextEmail });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
};

const updatePassword = async (admin, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new AppError('Vui lòng nhập đầy đủ mật khẩu', StatusCodes.BAD_REQUEST);
  }

  if (String(newPassword).length < 6) {
    throw new AppError('Mật khẩu mới tối thiểu 6 ký tự', StatusCodes.BAD_REQUEST);
  }

  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) throw new AppError('Mật khẩu hiện tại không đúng', StatusCodes.BAD_REQUEST);

  const hashed = await bcrypt.hash(newPassword, 12);
  await admin.update({ password: hashed });
};

const forgotPassword = async ({ email }) => {
  const nextEmail = String(email || '').trim().toLowerCase();
  if (!nextEmail) {
    throw new AppError('Vui lòng nhập email', StatusCodes.BAD_REQUEST);
  }

  const admin = await AdminUser.findOne({ where: { email: nextEmail, isActive: true } });
  if (!admin) return;

  const token = signResetToken('admin', admin);
  await sendPasswordResetEmail({
    to: admin.email,
    name: admin.name,
    resetUrl: buildResetUrl('admin', token),
  });
};

const resetPassword = async ({ token, newPassword }) => {
  if (!token || !newPassword) {
    throw new AppError('Token và mật khẩu mới là bắt buộc', StatusCodes.BAD_REQUEST);
  }

  if (String(newPassword).length < 6) {
    throw new AppError('Mật khẩu mới tối thiểu 6 ký tự', StatusCodes.BAD_REQUEST);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn', StatusCodes.BAD_REQUEST);
  }

  if (decoded.purpose !== 'password-reset' || decoded.accountType !== 'admin') {
    throw new AppError('Liên kết đặt lại mật khẩu không hợp lệ', StatusCodes.BAD_REQUEST);
  }

  const admin = await AdminUser.findByPk(decoded.id);
  if (!admin || !admin.isActive) {
    throw new AppError('Tài khoản không tồn tại hoặc đã bị khóa', StatusCodes.BAD_REQUEST);
  }

  if (Number(decoded.passwordVersion) !== new Date(admin.updatedAt).getTime()) {
    throw new AppError('Liên kết đặt lại mật khẩu đã được sử dụng hoặc không còn hiệu lực', StatusCodes.BAD_REQUEST);
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await admin.update({ password: hashed });
};

module.exports = {
  login,
  createAdmin,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
};
