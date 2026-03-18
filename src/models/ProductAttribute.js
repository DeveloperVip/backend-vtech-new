const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductAttribute = sequelize.define(
    'ProductAttribute',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,

        name: DataTypes.STRING(255),
        value: DataTypes.STRING(255),
    },
    {
        tableName: 'product_attributes',
        timestamps: true,
        indexes: [{ fields: ['productId'] }],
    },
);

module.exports = ProductAttribute;