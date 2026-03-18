const { Router } = require('express');
const productModel3dController = require('../controllers/productModel3dController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/model-3d:
 *   get:
 *     summary: Lấy mô hình 3D của sản phẩm
 *     tags: [Product Model 3D]
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
router.get('/products/:productId/model-3d', productModel3dController.getByProductId);

/**
 * @swagger
 * /products/{productId}/model-3d:
 *   put:
 *     summary: Thêm hoặc Cập nhật mô hình 3D cho sản phẩm
 *     tags: [Product Model 3D]
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
 *             required:
 *               - modelUrl
 *             properties:
 *               modelUrl:
 *                 type: string
 *                 example: "https://example.com/3d/model.gltf"
 *               textureUrl:
 *                 type: string
 *                 example: "https://example.com/3d/texture.png"
 *               poster:
 *                 type: string
 *                 example: "https://example.com/3d/poster.png"
 *               fileSize:
 *                 type: integer
 *                 example: 1234567
 *               images360:
 *                 type: array
 *                 description: "Mảng URL ảnh 360°"
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - "https://example.com/360/01.png"
 *                   - "https://example.com/360/02.png"
 *                   - "https://example.com/360/03.png"
 *               format:
 *                 type: string
 *                 description: "Định dạng file model 3D (glb, gltf, fbx...)"
 *                 example: "glb"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     productId:
 *                       type: integer
 *                       example: 101
 *                     modelUrl:
 *                       type: string
 *                       example: "https://example.com/3d/model.gltf"
 *                     textureUrl:
 *                       type: string
 *                       example: "https://example.com/3d/texture.png"
 *                     poster:
 *                       type: string
 *                       example: "https://example.com/3d/poster.png"
 *                     fileSize:
 *                       type: integer
 *                       example: 1234567
 *                     images360:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "https://example.com/360/01.png"
 *                         - "https://example.com/360/02.png"
 *                         - "https://example.com/360/03.png"
 *                     format:
 *                       type: string
 *                       example: "glb"
 *       404:
 *         description: Không tìm thấy sản phẩm
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
 *                   example: "Không tìm thấy sản phẩm"
 */
router.put('/products/:productId/model-3d',
    //  authMiddleware, 
    productModel3dController.upsert);

/**
 * @swagger
 * /products/{productId}/model-3d:
 *   delete:
 *     summary: Xóa mô hình 3D của sản phẩm
 *     tags: [Product Model 3D]
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
 *         description: Xóa thành công
 */
router.delete('/products/:productId/model-3d', authMiddleware, productModel3dController.delete);

module.exports = router;
