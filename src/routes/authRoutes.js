const { Router } = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login thành công
 *       400:
 *         description: Thiếu email hoặc password
 */
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin admin hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/me', authMiddleware, authController.me);
router.patch('/profile', authMiddleware, authController.updateProfile);
router.patch('/password', authMiddleware, authController.updatePassword);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout thành công
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
