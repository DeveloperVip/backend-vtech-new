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
  res.json({ success: true, data: req.admin });
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, me, logout };
