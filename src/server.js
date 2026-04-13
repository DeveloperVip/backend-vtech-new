require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./config/logger');
const authService = require('./services/authService');
const socketService = require('./services/socketService');
const { runSeeder } = require('./data/seeder');
const { start3DSyncJob, startOrphanCleanupJob } = require('./utils/backgroundJobs');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    if (NODE_ENV === 'development') {
      try {
        await sequelize.sync();
        logger.info('✅ Database models synchronized.');

        // 1. Chạy Auto-Seeder (Chỉ chạy khi DB trống hoặc SEED_DB=true)
        await runSeeder(process.env.SEED_DB === 'true');

        // 2. Tạo tài khoản admin mặc định nếu chưa có
        try {
          await authService.createAdmin({
            name: 'Super Admin',
            email: process.env.TK_ADMIN,
            password: process.env.MK_ADMIN,
            role: 'superadmin',
          });
          // logger.info('✅ Default admin created: admin@vitechs.com / Admin@123456');
        } catch {
          // Đã tồn tại - bỏ qua
        }
      }
      catch (error) {
        console.error('❌ FULL ERROR:', error);
        console.error('❌ SQL MESSAGE:', error?.original?.sqlMessage);
        console.error('❌ SQL:', error?.sql);
        throw error; // để nodemon biết mà crash
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

      // Khởi động các job đồng bộ 3D và dọn dẹp ngầm
      start3DSyncJob();
      startOrphanCleanupJob();
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
