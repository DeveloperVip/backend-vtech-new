const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChatRoom = sequelize.define(
  'ChatRoom',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Guest user identifier (email or unique ID)',
    },
    memberId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'User ID nếu là thành viên đã đăng nhập',
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    adminId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Admin handling this chat',
    },
    status: {
      type: DataTypes.ENUM('waiting', 'active', 'closed'),
      defaultValue: 'waiting',
      comment: 'waiting: chờ admin, active: đang chat, closed: đã đóng',
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userType: {
      type: DataTypes.ENUM('guest', 'member'),
      defaultValue: 'guest',
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
      comment: 'low: chưa cần gấp, normal: bình thường, high: ưu tiên, urgent: gấp',
    },
  },
  {
    tableName: 'chat_rooms',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['adminId'] },
      { fields: ['status'] },
    ],
  },
);

module.exports = ChatRoom;
