const { Router } = require('express');
const productLikeController = require('../controllers/productLikeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/like:
 *   post:
 *     summary: Thích hoặc Bỏ thích sản phẩm (Toggle Like)
 *     tags: [Product Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/products/:productId/like', authMiddleware, productLikeController.toggleLike);

/**
 * @swagger
 * /products/{productId}/like:
 *   get:
 *     summary: Kiểm tra xem user hiện tại đã thích sản phẩm chưa
 *     tags: [Product Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/products/:productId/like', authMiddleware, productLikeController.checkUserLiked);

module.exports = router;
