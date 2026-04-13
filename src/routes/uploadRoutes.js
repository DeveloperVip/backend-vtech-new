const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp')
const { cloudStorage } = require('../utils/storageCloudinary')
const { authMiddleware } = require('../middlewares/authMiddleware');
const cloudinary = require('cloudinary').v2;

const MAX_HEIGHT = parseInt(process.env.MAX_HEIGHT) || 1080;
const MAX_WIDTH = parseInt(process.env.MAX_WIDTH) || 1920;

const router = Router();

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../../uploads/product-images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});
//upload local
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.glb', '.gltf'];

    const isValidExt = allowedExt.includes(ext);
    const isValidMime = file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('model/') ||
      file.mimetype === 'application/octet-stream';;

    if (isValidExt && isValidMime) {
      cb(null, true);
    } else {
      console.log('❌ MIME:', file.mimetype);
      cb(new Error('Chỉ chấp nhận file ảnh hoặc 3D (jpg, png, glb, gltf)'));
    }
  }
});
//upload cloud
const uploadCloud = multer({
  storage: cloudStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

// POST /api/v1/upload  (cần đăng nhập admin)
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload ảnh (có kiểm tra kích thước)
 *     description: |
 *       Upload file ảnh lên server.
 *       - Giới hạn dung lượng: 5MB
 *       - Chỉ chấp nhận: jpg, png, webp, gif, svg
 *       - Giới hạn kích thước ảnh: MAX_WIDTH x MAX_HEIGHT
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: http://localhost:5000/uploads/1700000000-123456.png
 *                 filename:
 *                   type: string
 *                   example: 1700000000-123456.png
 *                 width:
 *                   type: integer
 *                   example: 800
 *                 height:
 *                   type: integer
 *                   example: 600
 *       400:
 *         description: Lỗi validate (file không hợp lệ hoặc quá kích thước)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: false
 *                 message: Ảnh vượt quá kích thước cho phép
 *       401:
 *         description: Không có quyền (chưa đăng nhập)
 *       500:
 *         description: Lỗi server
 */
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file' });
  }

  const filePath = path.join(uploadDir, req.file.filename);
  const ext = path.extname(req.file.filename).toLowerCase();
  const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);

  let width = null;
  let height = null;

  const cleanupFile = () => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        // Log nhẹ, không crash app
        console.warn('Cannot delete file:', unlinkErr);
      }
    }
  };

  try {
    if (isImage) {
      try {
        const fileBuffer = await fs.promises.readFile(filePath);
        const metadata = await sharp(fileBuffer).metadata();
        console.log("meta:", metadata)
        width = metadata.width;
        height = metadata.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          cleanupFile();
          return res.status(400).json({
            success: false,
            message: `Ảnh vượt quá kích thước (${MAX_WIDTH}x${MAX_HEIGHT})`,
          });
        }
      } catch (e) {
        cleanupFile();
        return res.status(400).json({
          success: false,
          message: 'File ảnh không hợp lệ',
        });
      }
    }

    const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/product-images/${req.file.filename}`;

    return res.json({
      success: true,
      url,
      filename: req.file.filename,
      width,
      height,
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Cannot delete file in catch:', unlinkErr);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Upload thất bại',
    });
  }
});

// DELETE /api/v1/upload/:filename  (cần đăng nhập admin)
/**
 * @swagger
 * /upload/{filename}:
 *   delete:
 *     summary: Xóa file đã upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 1700000000-123456.png
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:filename', authMiddleware, async (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) { console.warn(e); }
  }

  try {
    const { ProductModel3D } = require('../models');
    const { Op } = require('sequelize');
    const models = await ProductModel3D.findAll({
      where: { poster: { [Op.like]: `%${req.params.filename}` } }
    });
    
    for (const model of models) {
      if (model.modelUrl) {
         const glbFilename = model.modelUrl.split('/').pop().split('?')[0];
         const glbFilePath = path.join(__dirname, '../../uploads/product-models', glbFilename);
         if (fs.existsSync(glbFilePath)) {
             try { fs.unlinkSync(glbFilePath); console.log(`[Upload] Deleted GLB: ${glbFilename}`); } catch (e) { console.warn(e); }
         }
      }
      await model.destroy();
    }
  } catch (err) {
    console.error('[Upload] Error cleaning up associated GLB models:', err);
  }

  return res.json({ success: true });
});

// POST /api/v1/upload/upload-cloud  (cần đăng nhập admin)
/**
 * @swagger
 * /upload/upload-cloud:
 *   post:
 *     summary: Upload ảnh lên Cloudinary
 *     description: |
 *       Upload ảnh lên Cloudinary (cloud storage).
 *       - Giới hạn dung lượng: 5MB
 *       - Auto resize theo MAX_WIDTH x MAX_HEIGHT
 *       - Auto optimize + convert webp
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 */
router.post(
  '/upload-cloud',
  authMiddleware,
  uploadCloud.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file',
        });
      }

      return res.json({
        success: true,
        url: req.file.path,        // 🔥 URL Cloudinary
        public_id: req.file.filename, // 🔥 dùng để xóa
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Upload cloud thất bại',
      });
    }
  }
);
/**
 * @swagger
 * /upload/upload-cloud/{public_id}:
 *   delete:
 *     summary: Xóa ảnh trên Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/upload-cloud/:public_id', authMiddleware, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Xóa cloud thất bại',
    });
  }

});

/**
 * @swagger
 * /upload/upload-cloud/multi:
 *   post:
 *     summary: Upload nhiều ảnh lên Cloudinary (24-36 ảnh)
 *     description: |
 *       Upload nhiều ảnh dùng cho 360° product view.
 *       - Giới hạn mỗi ảnh: 5MB
 *       - Auto resize + convert webp
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                       public_id:
 *                         type: string
 */
router.post(
  '/upload-cloud/multi',
  // authMiddleware,
  uploadCloud.array('files', 36), // tối đa 36 ảnh
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'Không có file' });
      }

      const result = req.files.map(file => ({
        url: file.path,       // URL trên Cloudinary
        public_id: file.filename, // public_id dùng để xóa
      }));

      return res.json({ success: true, files: result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || 'Upload cloud thất bại' });
    }
  }
);
// POST /api/v1/upload/public (Công khai - dùng cho đánh giá sản phẩm)
/**
 * @swagger
 * /upload/public:
 *   post:
 *     summary: Upload ảnh công khai (dành cho người dùng đánh giá)
 *     description: Upload ảnh lên Cloudinary không cần token (cho phép khách hàng gửi ảnh thực tế)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 */
router.post(
  '/public',
  uploadCloud.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file' });
      }
      return res.json({
        success: true,
        url: req.file.path,
        public_id: req.file.filename,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Upload công khai thất bại' });
    }
  }
);

module.exports = router;
