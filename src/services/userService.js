const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
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

class UserService {
  async register({ name, username, email, password, phone }) {
    // Check if email or username exists
    const exists = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (exists) {
      if (exists.email === email) throw new AppError('Email đã được sử dụng', StatusCodes.CONFLICT);
      if (exists.username === username) throw new AppError('Tên đăng nhập đã tồn tại', StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      isActive: true
    });

    return this._generateTokenResponse(user);
  }

  async login(identifier, password) {
    // identifier can be email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
        isActive: true
      }
    });

    if (!user) throw new AppError('Thông tin đăng nhập không chính xác', StatusCodes.UNAUTHORIZED);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Thông tin đăng nhập không chính xác', StatusCodes.UNAUTHORIZED);

    await user.update({ lastLoginAt: new Date() });

    return this._generateTokenResponse(user);
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND);

    // Filter allowed fields
    const allowedFields = ['name', 'phone', 'avatar'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    await user.update(updateData);
    return user;
  }

  async changePassword(userId, { oldPassword, newPassword }) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND);

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new AppError('Mật khẩu cũ không chính xác', StatusCodes.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedPassword });
    
    return { success: true };
  }

  async forgotPassword({ identifier }) {
    const value = String(identifier || '').trim();
    if (!value) {
      throw new AppError('Vui lòng nhập email hoặc số điện thoại', StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: value.toLowerCase() }, { phone: value }],
        isActive: true,
      },
    });

    if (!user) return;

    const token = signResetToken('user', user);
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl: buildResetUrl('user', token),
    });
  }

  async resetPassword({ token, newPassword }) {
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

    if (decoded.purpose !== 'password-reset' || decoded.accountType !== 'user') {
      throw new AppError('Liên kết đặt lại mật khẩu không hợp lệ', StatusCodes.BAD_REQUEST);
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError('Tài khoản không tồn tại hoặc đã bị khóa', StatusCodes.BAD_REQUEST);
    }

    if (Number(decoded.passwordVersion) !== new Date(user.updatedAt).getTime()) {
      throw new AppError('Liên kết đặt lại mật khẩu đã được sử dụng hoặc không còn hiệu lực', StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedPassword });
  }

  async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND);
    return user;
  }

  _generateTokenResponse(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    };
  }
}

module.exports = new UserService();
