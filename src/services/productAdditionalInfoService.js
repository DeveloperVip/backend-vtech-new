const { ProductAdditionalInfo } = require('../models');

class ProductAdditionalInfoService {
  async getAllByProductId(productId, query) {
    const { isActive } = query;
    const where = { productId };
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return await ProductAdditionalInfo.findAll({
      where,
      order: [['sortOrder', 'ASC']]
    });
  }

  async create(data) {
    return await ProductAdditionalInfo.create(data);
  }

  async update(id, data) {
    const info = await ProductAdditionalInfo.findByPk(id);
    if (!info) throw new Error('Không tìm thấy thông tin bổ sung');
    return await info.update(data);
  }

  async delete(id) {
    const info = await ProductAdditionalInfo.findByPk(id);
    if (!info) throw new Error('Không tìm thấy thông tin bổ sung');
    await info.destroy();
    return true;
  }
}

module.exports = new ProductAdditionalInfoService();
