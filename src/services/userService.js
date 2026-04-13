const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

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
