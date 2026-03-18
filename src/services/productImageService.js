const { ProductImage } = require('../models');

class ProductImageService {
  async getAllByProductId(productId, query) {
    const { page = 1, limit = 10, type } = query;
    const offset = (page - 1) * limit;

    const where = { productId };
    if (type) where.type = type;

    const { rows, count } = await ProductImage.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
    };
  }

  async create(data) {
    return await ProductImage.create(data);
  }

  async update(id, data) {
    const image = await ProductImage.findByPk(id);
    if (!image) throw new Error('Không tìm thấy ảnh sản phẩm');
    return await image.update(data);
  }

  async delete(id) {
    const image = await ProductImage.findByPk(id);
    if (!image) throw new Error('Không tìm thấy ảnh sản phẩm');
    await image.destroy();
    return true;
  }
}

module.exports = new ProductImageService();
