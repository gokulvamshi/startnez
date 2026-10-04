require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { corsOptions } = require('./src/config/cors');
const { generalLimiter } = require('./src/config/rateLimit');
const { errorHandler } = require('./src/middleware/errorHandler');

// Route Imports
const authRoutes = require('./src/routes/auth.routes');
const profileRoutes = require('./src/routes/profile.routes');
const skillsRoutes = require('./src/routes/skills.routes');
const connectionRoutes = require('./src/routes/connection.routes');
const postRoutes = require('./src/routes/post.routes');
const startupRoutes = require('./src/routes/startup.routes');
const projectRoutes = require('./src/routes/project.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const searchRoutes = require('./src/routes/search.routes');
const uploadRoutes = require('./src/routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Performance Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'HackConnect Production API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes (support both /api/* and root /* for seamless client compatibility)
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/profiles`, profileRoutes);
  app.use(`${prefix}/skills`, skillsRoutes);
  app.use(`${prefix}/connections`, connectionRoutes);
  app.use(`${prefix}/posts`, postRoutes);
  app.use(`${prefix}/startups`, startupRoutes);
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/search`, searchRoutes);
  app.use(`${prefix}/upload`, uploadRoutes);
};

registerRoutes('/api');
registerRoutes('');

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[HackConnect Backend] Server running on http://localhost:${PORT}`);
    console.log(`[HackConnect Backend] Health check available at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
