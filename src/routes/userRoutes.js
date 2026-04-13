const { Router } = require('express');
const userAuthController = require('../controllers/userAuthController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký thành viên mới
 *     tags: [Users]
 */
router.post('/register', userAuthController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Đăng nhập thành viên
 *     tags: [Users]
 */
router.post('/login', userAuthController.login);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authMiddleware, userAuthController.getMe);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/profile', authMiddleware, userAuthController.updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Thay đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', authMiddleware, userAuthController.changePassword);

module.exports = router;
