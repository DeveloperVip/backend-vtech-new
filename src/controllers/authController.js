const authService = require('../services/authService');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Email and password are required' });

    const result = await authService.login(email, password);
    return res.status(StatusCodes.OK).json({ success: true, message: 'Login successful', ...result });
  } catch (err) { next(err); }
};

const me = (req, res) => {
  if (req.admin) {
    const { password, ...adminData } = req.admin.toJSON ? req.admin.toJSON() : req.admin;
    return res.json({ success: true, data: adminData });
  }
  if (req.user) {
    const { password, ...userData } = req.user.toJSON ? req.user.toJSON() : req.user;
    return res.json({ success: true, data: userData });
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Not authenticated' });
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

const updateProfile = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Admin only' });
    }

    const admin = await authService.updateProfile(req.admin, req.body);
    return res.json({ success: true, message: 'Cập nhật thông tin thành công', data: admin });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Admin only' });
    }

    await authService.updatePassword(req.admin, req.body);
    return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body);
    return res.json({
      success: true,
      message: 'Nếu tài khoản tồn tại, hệ thống đã gửi email đặt lại mật khẩu',
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  me,
  logout,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
};
