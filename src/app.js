require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const logger = require('./config/logger');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // cho phép load ảnh từ domain khác
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── HTTP Logger ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use(apiLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
app.use(API_PREFIX, routes);

// ─── Static files (uploads) ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '/swagger.css',
  customSiteTitle: "Api vitech"
}));
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
