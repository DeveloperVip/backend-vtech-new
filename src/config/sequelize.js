const { Sequelize } = require('sequelize');
const config = require('./database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    ...dbConfig,
    define: {
      ...dbConfig.define,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  },
);

module.exports = sequelize;
