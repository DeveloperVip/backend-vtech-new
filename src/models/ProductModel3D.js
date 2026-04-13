const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductModel3D = sequelize.define(
    'ProductModel3D',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

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

        // Trạng thái chuyển đổi từ ảnh sang 3D
        conversionStatus: {
            type: DataTypes.ENUM('none', 'pending', 'processing', 'succeeded', 'failed'),
            defaultValue: 'none'
        },
        conversionTaskId: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sourceViews: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Lưu 4 ảnh hướng (mặt trước, sau, trái, phải) dùng để tạo 3D'
        }
    },
    {
        tableName: 'product_models',
        timestamps: true,
        indexes: [{ fields: ['productId'] }],
    },
);

module.exports = ProductModel3D;