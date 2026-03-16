require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./config/logger');
const authService = require('./services/authService');
const socketService = require('./services/socketService');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database models synchronized.');

      // Tạo tài khoản admin mặc định nếu chưa có
      try {
        await authService.createAdmin({
          name: 'Super Admin',
          email: 'admin@vitechs.com',
          password: 'Admin@123456',
          role: 'superadmin',
        });
        logger.info('✅ Default admin created: admin@vitechs.com / Admin@123456');
      } catch {
        // Đã tồn tại - bỏ qua
      }
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Initialize socket service
    socketService.initialize(io);
    logger.info('✅ Socket.IO initialized');

    server.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
      logger.info(`💬 WebSocket: ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

startServer();
