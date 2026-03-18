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
}

module.exports = new ProductLikeService();
