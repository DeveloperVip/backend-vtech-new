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

module.exports = { login, me, logout };
