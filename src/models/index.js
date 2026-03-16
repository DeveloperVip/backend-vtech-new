const sequelize = require('../config/sequelize');
const Contact = require('./Contact');
const AdminUser = require('./AdminUser');
const Category = require('./Category');
const Product = require('./Product');
const Post = require('./Post');
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Chat associations
ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId', as: 'messages' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId', as: 'room' });

ChatRoom.belongsTo(AdminUser, { foreignKey: 'adminId', as: 'admin' });
AdminUser.hasMany(ChatRoom, { foreignKey: 'adminId', as: 'chatRooms' });

const db = {
  sequelize,
  Contact,
  AdminUser,
  Category,
  Product,
  Post,
  ChatRoom,
  ChatMessage,
};

module.exports = db;
