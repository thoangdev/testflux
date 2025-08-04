export function errorHandler(error, request, reply) {
  const { log } = request;

  // Log the error
  log.error(error);

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
  }

  // Handle JWT errors
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return reply.status(401).send({
      error: 'No authorization header'
    });
  }

  // Handle database errors
  if (error.code && error.code.startsWith('23')) {
    return reply.status(400).send({
      error: 'Database constraint violation'
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.message || 'Internal Server Error',
    statusCode
  });
}
