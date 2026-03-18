const { Router } = require('express');
const productReviewController = require('../controllers/productReviewController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     summary: Lấy danh sách đánh giá của sản phẩm
 *     tags: [Product Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           description: Lọc theo số sao
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/products/:productId/reviews', productReviewController.getAllByProductId);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     summary: Thêm đánh giá cho sản phẩm
 *     tags: [Product Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, rating, content]
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               rating:
 *                 type: integer
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     width:
 *                       type: integer
 *                     height:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/products/:productId/reviews', productReviewController.create);

/**
 * @swagger
 * /product-reviews/{id}:
 *   put:
 *     summary: Cập nhật đánh giá
 *     tags: [Product Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "a@example.com"
 *               rating:
 *                 type: integer
 *                 example: 5
 *               content:
 *                 type: string
 *                 example: "Sản phẩm rất tốt"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật đánh giá thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userName:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "a@example.com"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     content:
 *                       type: string
 *                       example: "Sản phẩm rất tốt"
 *       404:
 *         description: Không tìm thấy đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy đánh giá"
 */
router.put('/product-reviews/:id', authMiddleware, productReviewController.update);

/**
 * @swagger
 * /product-reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá
 *     tags: [Product Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/product-reviews/:id', authMiddleware, productReviewController.delete);

module.exports = router;
