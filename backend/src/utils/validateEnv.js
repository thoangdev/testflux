import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  // Server configuration
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  HOST: Joi.string().default('localhost'),

  // Database configuration
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  DB_USER: Joi.string().when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),

  // Security configuration
  JWT_SECRET: Joi.string().min(32).required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW: Joi.number().default(15), // minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // File upload configuration
  MAX_FILE_SIZE: Joi.string().default('50MB'),
  UPLOAD_DIR: Joi.string().default('./uploads'),
  ALLOWED_FILE_TYPES: Joi.string().default('xml,json'),

  // Email configuration (optional)
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),

  // Notification configuration (optional)
  SLACK_WEBHOOK_URL: Joi.string().uri().optional(),

  // Logging configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'trace')
    .default('info'),
}).unknown();

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env);

if (error) {
  console.error('❌ Environment validation failed:');
  console.error(error.details.map(detail => `  - ${detail.message}`).join('\n'));
  process.exit(1);
}

console.log('✅ Environment validation passed');

// Export validated environment
export default env;
