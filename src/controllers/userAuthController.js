const userService = require('../services/userService');
const { StatusCodes } = require('http-status-codes');

class UserAuthController {
  register = async (req, res, next) => {
    try {
      const result = await userService.register(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { identifier, password } = req.body;
      const result = await userService.login(identifier, password);
      res.status(StatusCodes.OK).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req, res, next) => {
    try {
      const user = await userService.getMe(req.user.id);
      res.status(StatusCodes.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.status(StatusCodes.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const result = await userService.changePassword(req.user.id, req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserAuthController();
