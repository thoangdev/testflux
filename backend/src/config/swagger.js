// Swagger/OpenAPI configuration
export const swaggerOptions = {
  swagger: {
    info: {
      title: 'TestFlux API',
      description: 'Enterprise test results dashboard API documentation',
      version: '1.0.0',
      contact: {
        name: 'TestFlux Team',
        email: 'api@testflux.com',
        url: 'https://github.com/your-org/testflux',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    host: process.env.NODE_ENV === 'production' ? 'api.testflux.com' : 'localhost:3001',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter: Bearer {token}',
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Upload',
        description: 'Test results upload endpoints',
      },
      {
        name: 'Results',
        description: 'Test results query endpoints',
      },
      {
        name: 'Trends',
        description: 'Trend analysis endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)',
      },
      {
        name: 'Health',
        description: 'System health and monitoring',
      },
    ],
  },
  exposeRoute: true,
  routePrefix: '/docs',
  staticCSP: true,
  transformStaticCSP: (header) => header,
};

// Common response schemas
export const commonSchemas = {
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'number' },
      details: { type: 'object' },
    },
    required: ['error', 'statusCode'],
  },
  
  Success: {
    type: 'object',
    properties: {
      success: { type: 'boolean', default: true },
      message: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['success'],
  },
  
  PaginatedResponse: {
    type: 'object',
    properties: {
      data: { type: 'array' },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
    },
  },
  
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'user'] },
      isActive: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  
  Product: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      description: { type: 'string' },
      isActive: { type: 'boolean' },
      createdBy: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  
  TestRun: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      productId: { type: 'string', format: 'uuid' },
      environmentId: { type: 'string', format: 'uuid' },
      testTypeId: { type: 'string', format: 'uuid' },
      runName: { type: 'string' },
      runTimestamp: { type: 'string', format: 'date-time' },
      source: { type: 'string', enum: ['api', 'manual', 'github_actions'] },
      sourceMetadata: { type: 'object' },
      uploadedBy: { type: 'string', format: 'uuid' },
      uploadedAt: { type: 'string', format: 'date-time' },
      totalFiles: { type: 'number' },
      processingStatus: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
      errorMessage: { type: 'string' },
    },
  },
  
  RobotResult: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      testRunId: { type: 'string', format: 'uuid' },
      fileName: { type: 'string' },
      suiteName: { type: 'string' },
      totalTests: { type: 'number' },
      passedTests: { type: 'number' },
      failedTests: { type: 'number' },
      skippedTests: { type: 'number' },
      executionTimeMs: { type: 'number' },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
      rawData: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  
  ZapResult: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      testRunId: { type: 'string', format: 'uuid' },
      fileName: { type: 'string' },
      scanName: { type: 'string' },
      targetUrl: { type: 'string' },
      highAlerts: { type: 'number' },
      mediumAlerts: { type: 'number' },
      lowAlerts: { type: 'number' },
      infoAlerts: { type: 'number' },
      scanTimestamp: { type: 'string', format: 'date-time' },
      rawData: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  
  K6Result: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      testRunId: { type: 'string', format: 'uuid' },
      fileName: { type: 'string' },
      testName: { type: 'string' },
      vusMax: { type: 'number' },
      iterations: { type: 'number' },
      checksPassed: { type: 'number' },
      checksFailed: { type: 'number' },
      httpReqDurationAvg: { type: 'number' },
      httpReqDurationP95: { type: 'number' },
      httpReqDurationMax: { type: 'number' },
      testDurationMs: { type: 'number' },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
      rawData: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
};

// Swagger UI configuration
export const swaggerUIOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: swaggerOptions.swagger.info,
    host: swaggerOptions.swagger.host,
    schemes: swaggerOptions.swagger.schemes,
    consumes: swaggerOptions.swagger.consumes,
    produces: swaggerOptions.swagger.produces,
    securityDefinitions: swaggerOptions.swagger.securityDefinitions,
    security: swaggerOptions.swagger.security,
    tags: swaggerOptions.swagger.tags,
    definitions: commonSchemas,
  },
};
