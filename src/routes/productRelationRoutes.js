const { Router } = require('express');
const productRelationController = require('../controllers/productRelationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/relations:
 *   get:
 *     summary: Lấy danh sách sản phẩm liên quan/gợi ý
 *     tags: [Product Relations]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [related, similar, upsell]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/products/:productId/relations', productRelationController.getAllByProductId);

/**
 * @swagger
 * /products/{productId}/relations:
 *   post:
 *     summary: Thêm sản phẩm liên quan
 *     tags: [Product Relations]
 *     security:
 *       - bearerAuth: []
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
 *             required: [relatedProductId, type]
 *             properties:
 *               relatedProductId:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [related, similar, upsell]
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/products/:productId/relations', authMiddleware, productRelationController.create);

/**
 * @swagger
 * /product-relations/{id}:
 *   delete:
 *     summary: Xóa một liên kết sản phẩm
 *     tags: [Product Relations]
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
router.delete('/product-relations/:id', authMiddleware, productRelationController.delete);

module.exports = router;
