const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
      && allowed.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp, gif, svg)'));
  },
});

// POST /api/v1/upload  (cần đăng nhập admin)
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Không có file' });
  const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  return res.json({ success: true, url, filename: req.file.filename });
});

// DELETE /api/v1/upload/:filename  (cần đăng nhập admin)
router.delete('/:filename', authMiddleware, (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return res.json({ success: true });
});

module.exports = router;
