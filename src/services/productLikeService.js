const { ProductLike, Product } = require('../models');

class ProductLikeService {
  async toggleLike(productId, userId) {
    const existingLike = await ProductLike.findOne({
      where: { productId, userId }
    });

    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Không tìm thấy sản phẩm');

    if (existingLike) {
      // User has already liked, so unlike it
      await existingLike.destroy();
      await product.decrement('likeCount', { by: 1 });
      return { liked: false, newLikeCount: product.likeCount - 1 };
    } else {
      // User hasn't liked, so like it
      await ProductLike.create({ productId, userId });
      await product.increment('likeCount', { by: 1 });
      return { liked: true, newLikeCount: product.likeCount + 1 };
    }
  }

  async checkUserLiked(productId, userId) {
    if (!userId) return false;
    const existingLike = await ProductLike.findOne({
      where: { productId, userId }
    });
    return !!existingLike;
  }

  async getLikedProducts(userId, { page, limit }) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await ProductLike.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'slug', 'thumbnail'],
          include: [
            { model: require('../models').Category, as: 'category', attributes: ['name', 'slug'] },
            { model: require('../models').ProductImage, as: 'images', limit: 1 }
          ]
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products: rows.map(row => row.Product)
    };
  }
}

module.exports = new ProductLikeService();
