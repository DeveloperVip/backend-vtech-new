const { ProductModel3D } = require('../models');

class ProductModel3DService {
  async getByProductId(productId) {
    return await ProductModel3D.findOne({ where: { productId } });
  }

  async upsert(productId, data) {
    let model3d = await this.getByProductId(productId);
    
    if (model3d) {
      return await model3d.update(data);
    } else {
      return await ProductModel3D.create({ ...data, productId });
    }
  }

  async deleteByProductId(productId) {
    const model3d = await this.getByProductId(productId);
    if (!model3d) throw new Error('Không tìm thấy mô hình 3D của sản phẩm này');
    
    await model3d.destroy();
    return true;
  }
}

module.exports = new ProductModel3DService();
