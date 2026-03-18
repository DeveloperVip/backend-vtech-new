const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductLike = sequelize.define(
    'ProductLike',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,
        userId: DataTypes.INTEGER.UNSIGNED,
    },
    {
        tableName: 'product_likes',
        timestamps: true,
        indexes: [
            { unique: true, fields: ['productId', 'userId'] },
        ],
    },
);

module.exports = ProductLike;