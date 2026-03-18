const { Router } = require('express');
const contactRoutes = require('./contactRoutes');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const postRoutes = require('./postRoutes');
const uploadRoutes = require('./uploadRoutes');
const chatRoutes = require('./chatRoutes');

// Product sub-resources
const productImageRoutes = require('./productImageRoutes');
const productReviewRoutes = require('./productReviewRoutes');
const productModel3dRoutes = require('./productModel3dRoutes');
const productAttributeRoutes = require('./productAttributeRoutes');
const productAdditionalInfoRoutes = require('./productAdditionalInfoRoutes');
const productLikeRoutes = require('./productLikeRoutes');
const productRelationRoutes = require('./productRelationRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);
router.use('/chat', chatRoutes);

// Bổ sung các routes con của Product (Mount ở root vì bên trong đã định nghĩa sẵn path chi tiết)
router.use('/', productImageRoutes);
router.use('/', productReviewRoutes);
router.use('/', productModel3dRoutes);
router.use('/', productAttributeRoutes);
router.use('/', productAdditionalInfoRoutes);
router.use('/', productLikeRoutes);
router.use('/', productRelationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
