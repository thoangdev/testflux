import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import env from '../utils/validateEnv.js';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create transports
const transports = [];

// Console transport for development
if (env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: env.LOG_LEVEL,
    })
  );
}

// File transports for production
if (env.NODE_ENV === 'production') {
  // Error logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    })
  );

  // Combined logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    })
  );

  // Console for production (JSON format)
  transports.push(
    new winston.transports.Console({
      format: logFormat,
      level: env.LOG_LEVEL,
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Handle uncaught exceptions and unhandled rejections
if (env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
    })
  );

  logger.rejections.handle(
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
    })
  );
}

// Create structured logging functions
export const log = {
  error: (message, meta = {}) => logger.error(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  info: (message, meta = {}) => logger.info(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // Specific logging functions
  auth: (message, meta = {}) => logger.info(message, { category: 'auth', ...meta }),
  api: (message, meta = {}) => logger.info(message, { category: 'api', ...meta }),
  db: (message, meta = {}) => logger.info(message, { category: 'database', ...meta }),
  upload: (message, meta = {}) => logger.info(message, { category: 'upload', ...meta }),
  notification: (message, meta = {}) => logger.info(message, { category: 'notification', ...meta }),
  
  // Performance logging
  performance: (operation, duration, meta = {}) => {
    logger.info(`Performance: ${operation} completed in ${duration}ms`, {
      category: 'performance',
      operation,
      duration,
      ...meta,
    });
  },
  
  // Security logging
  security: (event, meta = {}) => {
    logger.warn(`Security event: ${event}`, {
      category: 'security',
      event,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },
};

// Express middleware for request logging
export const requestLogger = (request, reply, done) => {
  const start = Date.now();
  
  reply.addHook('onSend', (request, reply, payload, done) => {
    const duration = Date.now() - start;
    
    log.api('Request completed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      userId: request.user?.id,
    });
    
    done();
  });
  
  done();
};

export default logger;
