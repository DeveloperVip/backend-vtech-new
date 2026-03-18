const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductModel3D = sequelize.define(
    'ProductModel3D',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,

        modelUrl: DataTypes.STRING(500),
        textureUrl: DataTypes.STRING(500),
        poster: DataTypes.STRING(500),

        // Nếu là 360 view, có thể lưu mảng ảnh dạng JSON
        images360: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Mảng URL ảnh 360 độ (nếu có)'
        },

        // Format file model (glb/gltf/fbx)
        format: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'glb, gltf, fbx...'
        },

        fileSize: DataTypes.INTEGER,
    },
    {
        tableName: 'product_models',
        timestamps: true,
        indexes: [{ fields: ['productId'] }],
    },
);

module.exports = ProductModel3D;