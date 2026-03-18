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
    
    // Auto set hasImages based on input images array
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

    return await ProductReview.findByPk(review.id, {
      include: [{ model: ProductReviewImage }],
    });
  }

  async update(id, data) {
    const review = await ProductReview.findByPk(id);
    if (!review) throw new Error('Không tìm thấy đánh giá');
    return await review.update(data);
  }

  async delete(id) {
    const review = await ProductReview.findByPk(id);
    if (!review) throw new Error('Không tìm thấy đánh giá');
    
    // It will be handled by DB ON DELETE CASCADE or manually delete images first:
    await ProductReviewImage.destroy({ where: { reviewId: id } });
    await review.destroy();
    return true;
  }
}

module.exports = new ProductReviewService();
