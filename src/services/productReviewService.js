const { ProductReview, ProductReviewImage } = require('../models');

class ProductReviewService {
  async getAllByProductId(productId, query) {
    const { page = 1, limit = 10, rating } = query;
    const offset = (page - 1) * limit;

    const where = { productId };
    if (rating) where.rating = rating;

    const { rows, count } = await ProductReview.findAndCountAll({
      where,
      include: [
        {
          model: ProductReviewImage,
          attributes: ['id', 'url', 'width', 'height'],
        },
        // We handle user-specific liked status in frontend or a separate call
        // but let's include the total likes if needed. 
        // ProductReview model already has likeCount if we use counter cache.
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true, // required when include hasMany to get correct count
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
    };
  }

  async create(data) {
    const { images, ...reviewData } = data;
    
    if (images && images.length > 0) {
      reviewData.hasImages = true;
    }

    const review = await ProductReview.create(reviewData);

    if (images && images.length > 0) {
      const imageRecords = images.map(img => ({
        reviewId: review.id,
        url: img.url,
        width: img.width,
        height: img.height,
      }));
      await ProductReviewImage.bulkCreate(imageRecords);
    }

    // 🔥 Cập nhật rating trung bình cho sản phẩm
    await this._updateProductRating(data.productId);

    return await ProductReview.findByPk(review.id, {
      include: [{ model: ProductReviewImage }],
    });
  }

  async update(id, data) {
    const review = await ProductReview.findByPk(id);
    if (!review) throw new Error('Không tìm thấy đánh giá');
    await review.update(data);
    
    // 🔥 Cập nhật lại rating nếu có thay đổi số sao
    if (data.rating !== undefined) {
      await this._updateProductRating(review.productId);
    }
    
    return review;
  }

  async delete(id) {
    const review = await ProductReview.findByPk(id);
    if (!review) throw new Error('Không tìm thấy đánh giá');
    
    const productId = review.productId;
    await ProductReviewImage.destroy({ where: { reviewId: id } });
    await review.destroy();

    // 🔥 Cập nhật lại rating sau khi xóa
    await this._updateProductRating(productId);
    
    return true;
  }

  async toggleLike(reviewId, userId, ipAddress) {
    const { ProductReviewLike } = require('../models');
    
    // Find if already liked
    let where = { reviewId };
    if (userId) {
      where.userId = userId;
    } else {
      where.ipAddress = ipAddress;
      where.userId = null; // Important to check for guest likes specifically
    }

    const existingLike = await ProductReviewLike.findOne({ where });
    const review = await ProductReview.findByPk(reviewId);
    if (!review) throw new Error('Không tìm thấy đánh giá');

    if (existingLike) {
      await existingLike.destroy();
      await review.decrement('likeCount', { by: 1 });
      return { liked: false, likeCount: review.likeCount - 1 };
    } else {
      await ProductReviewLike.create({ reviewId, userId, ipAddress });
      await review.increment('likeCount', { by: 1 });
      return { liked: true, likeCount: review.likeCount + 1 };
    }
  }

  // Helper cập nhật điểm trung bình
  async _updateProductRating(productId) {
    const { Product } = require('../models');
    
    const result = await ProductReview.findAll({
      where: { productId },
      attributes: [
        [ProductReview.sequelize.fn('AVG', ProductReview.sequelize.col('rating')), 'avgRating'],
        [ProductReview.sequelize.fn('COUNT', ProductReview.sequelize.col('id')), 'countRating'],
      ],
      raw: true
    });

    const avg = parseFloat(result[0].avgRating) || 0;
    const count = parseInt(result[0].countRating) || 0;

    await Product.update(
      { ratingAvg: avg, ratingCount: count },
      { where: { id: productId } }
    );
  }
}

module.exports = new ProductReviewService();
