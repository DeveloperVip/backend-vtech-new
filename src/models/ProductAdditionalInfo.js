const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductAdditionalInfo = sequelize.define(
    'ProductAdditionalInfo',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Ví dụ: Kích thước, Chất liệu...',
        },

        value: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            comment: 'Nội dung dạng Markdown/HTML (có ảnh, link...)',
        },

        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'product_additional_infos',
        timestamps: true,
        indexes: [
            { fields: ['productId'] },
            { fields: ['isActive'] },
            { fields: ['sortOrder'] },
        ],
    },
);

module.exports = ProductAdditionalInfo;