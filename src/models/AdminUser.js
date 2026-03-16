const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdminUser = sequelize.define(
  'AdminUser',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('superadmin', 'admin', 'editor'), defaultValue: 'admin' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'admin_users', timestamps: true },
);

module.exports = AdminUser;
