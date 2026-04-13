const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Lấy dữ liệu thống kê tổng hợp cho Dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về object chứa các thông số đếm và trạng thái AI
 */
router.get('/stats', authMiddleware, adminController.getStats);

module.exports = router;
