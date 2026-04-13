const bcrypt = require('bcryptjs');
const { 
  sequelize, 
  Category, 
  Product, 
  ProductImage, 
  ProductAttribute, 
  ProductAdditionalInfo, 
  Post, 
  User 
} = require('../models');
const seedData = require('./seedData');
const logger = require('../config/logger');

const runSeeder = async (force = false) => {
  try {
    // 1. Kiểm tra xem đã có dữ liệu chưa
    const categoryCount = await Category.count();
    
    // Nếu không force và đã có dữ liệu, bỏ qua
    if (categoryCount > 0 && !force) {
      logger.info('ℹ️  Database already has data. Skipping seeder.');
      return;
    }

    logger.info('🌱 Starting database seeding...');

    await sequelize.transaction(async (t) => {
      // Xóa dữ liệu cũ nếu force=true
      if (force) {
        // Thứ tự xóa phải ngược lại với thứ tự tạo để tránh ràng buộc khóa ngoại
        await ProductImage.destroy({ where: {}, transaction: t });
        await ProductAttribute.destroy({ where: {}, transaction: t });
        await ProductAdditionalInfo.destroy({ where: {}, transaction: t });
        await Product.destroy({ where: {}, transaction: t });
        await Category.destroy({ where: {}, transaction: t });
        await Post.destroy({ where: {}, transaction: t });
        await User.destroy({ where: {}, transaction: t });
      }

      // 2. Seed Categories
      logger.info('   Creating categories...');
      await Category.bulkCreate(seedData.categories, { transaction: t });

      // 3. Seed Products và các thành phần liên quan
      logger.info('   Creating products and related data...');
      for (const pData of seedData.products) {
        const { attributes, additionalInfo, images, ...productFields } = pData;
        
        // Tạo sản phẩm
        const product = await Product.create(productFields, { transaction: t });

        // Tạo attributes
        if (attributes && attributes.length > 0) {
          await ProductAttribute.bulkCreate(
            attributes.map(attr => ({ ...attr, productId: product.id })),
            { transaction: t }
          );
        }

        // Tạo additional info
        if (additionalInfo && additionalInfo.length > 0) {
          await ProductAdditionalInfo.bulkCreate(
            additionalInfo.map(info => ({ ...info, productId: product.id })),
            { transaction: t }
          );
        }

        // Tạo images
        if (images && images.length > 0) {
          await ProductImage.bulkCreate(
            images.map((url, idx) => ({
              productId: product.id,
              url,
              type: idx === 0 ? 'thumbnail' : 'gallery',
              sortOrder: idx
            })),
            { transaction: t }
          );
        }
      }

      // 4. Seed Posts
      logger.info('   Creating posts...');
      await Post.bulkCreate(seedData.posts, { transaction: t });

      // 5. Seed Users
      logger.info('   Creating member users...');
      const hashedUsers = await Promise.all(seedData.users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        return { ...u, password: hashedPassword };
      }));
      await User.bulkCreate(hashedUsers, { transaction: t });
    });

    logger.info('✅ Database seeded successfully!');
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    // Không crash server nếu seed lỗi, để người dùng vẫn vào được hệ thống trống
  }
};

module.exports = { runSeeder };
