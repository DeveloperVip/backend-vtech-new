const { ProductAttribute } = require('../models');

class ProductAttributeService {
  async getAllByProductId(productId) {
    // Không cần phân trang vì số lượng attribute thường nhỏ hơn 50/sản phẩm
    return await ProductAttribute.findAll({
      where: { productId }
    });
  }

  async create(data) {
    return await ProductAttribute.create(data);
  }

  async update(id, data) {
    const attribute = await ProductAttribute.findByPk(id);
    if (!attribute) throw new Error('Không tìm thấy thuộc tính');
    return await attribute.update(data);
  }

  async delete(id) {
    const attribute = await ProductAttribute.findByPk(id);
    if (!attribute) throw new Error('Không tìm thấy thuộc tính');
    await attribute.destroy();
    return true;
  }
}

module.exports = new ProductAttributeService();
