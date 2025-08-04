import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
import trendsRoutes from './routes/trends.js';
import resultsRoutes from './routes/results.js';
import usersRoutes from './routes/users.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

await fastify.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  timeWindow: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000 // minutes to ms
});

// Register middleware
fastify.addHook('onRequest', authMiddleware);
fastify.setErrorHandler(errorHandler);

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(productRoutes, { prefix: '/api/products' });
fastify.register(uploadRoutes, { prefix: '/api/upload' });
fastify.register(trendsRoutes, { prefix: '/api/trends' });
fastify.register(resultsRoutes, { prefix: '/api/results' });
fastify.register(usersRoutes, { prefix: '/api/users' });

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
