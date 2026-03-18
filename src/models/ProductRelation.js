const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductRelation = sequelize.define(
    'ProductRelation',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,
        relatedProductId: DataTypes.INTEGER.UNSIGNED,

        type: {
            type: DataTypes.ENUM('related', 'similar', 'upsell'),
            defaultValue: 'related',
        },
    },
    {
        tableName: 'product_relations',
        timestamps: true,
        indexes: [
            { fields: ['productId'] },
            { fields: ['relatedProductId'] },
        ],
    },
);

module.exports = ProductRelation;