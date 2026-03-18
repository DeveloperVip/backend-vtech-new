const { Router } = require('express');
const productAdditionalInfoController = require('../controllers/productAdditionalInfoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/additional-info:
 *   get:
 *     summary: Lấy danh sách thông tin bổ sung của sản phẩm
 *     tags: [Product Additional Info]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/products/:productId/additional-info', productAdditionalInfoController.getAllByProductId);

/**
 * @swagger
 * /products/{productId}/additional-info:
 *   post:
 *     summary: Thêm thông tin bổ sung cho sản phẩm
 *     tags: [Product Additional Info]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/products/:productId/additional-info', authMiddleware, productAdditionalInfoController.create);

/**
 * @swagger
 * /product-additional-infos/{id}:
 *   put:
 *     summary: Cập nhật thông tin bổ sung
 *     tags: [Product Additional Info]
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
 *               value:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/product-additional-infos/:id', authMiddleware, productAdditionalInfoController.update);

/**
 * @swagger
 * /product-additional-infos/{id}:
 *   delete:
 *     summary: Xóa thông tin bổ sung
 *     tags: [Product Additional Info]
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
 *                   example: "Xóa thành công"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy thông tin
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
 *                   example: "Không tìm thấy thông tin"
 */
router.delete('/product-additional-infos/:id', authMiddleware, productAdditionalInfoController.delete);

module.exports = router;
