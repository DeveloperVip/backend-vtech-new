const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define(
    'User',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        phone: { type: DataTypes.STRING(20), allowNull: true },
        avatar: { type: DataTypes.STRING(255), allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        lastLoginAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'users', timestamps: true },
);

module.exports = User;
