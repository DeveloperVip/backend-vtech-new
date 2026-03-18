const { Router } = require('express');
const productAttributeController = require('../controllers/productAttributeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/attributes:
 *   get:
 *     summary: Lấy danh sách thuộc tính của sản phẩm
 *     tags: [Product Attributes]
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
router.get('/products/:productId/attributes', productAttributeController.getAllByProductId);

/**
 * @swagger
 * /products/{productId}/attributes:
 *   post:
 *     summary: Thêm thuộc tính cho sản phẩm
 *     tags: [Product Attributes]
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
 *             required: [name, value]
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/products/:productId/attributes', authMiddleware, productAttributeController.create);

/**
 * @swagger
 * /product-attributes/{id}:
 *   put:
 *     summary: Cập nhật thuộc tính
 *     tags: [Product Attributes]
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
 *               name:
 *                 type: string
 *                 example: "Màu sắc"
 *               value:
 *                 type: string
 *                 example: "Đỏ"
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
 *                   example: "Cập nhật thuộc tính thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Màu sắc"
 *                     value:
 *                       type: string
 *                       example: "Đỏ"
 *       404:
 *         description: Không tìm thấy thuộc tính
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
 *                   example: "Không tìm thấy thuộc tính"
 */
router.put('/product-attributes/:id', authMiddleware, productAttributeController.update);

/**
 * @swagger
 * /product-attributes/{id}:
 *   delete:
 *     summary: Xóa thuộc tính
 *     tags: [Product Attributes]
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
router.delete('/product-attributes/:id', authMiddleware, productAttributeController.delete);

module.exports = router;
