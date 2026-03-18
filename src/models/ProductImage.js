const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductImage = sequelize.define(
    'ProductImage',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,

        url: DataTypes.STRING(500),

        type: {
            type: DataTypes.ENUM('thumbnail', 'gallery', '360'),
            defaultValue: 'gallery',
        },

        width: DataTypes.INTEGER,
        height: DataTypes.INTEGER,

        sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        tableName: 'product_images',
        timestamps: true,
        indexes: [
            { fields: ['productId'] },
            { fields: ['type'] },
        ],
    },
);

module.exports = ProductImage;