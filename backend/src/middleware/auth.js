export async function authMiddleware(request, reply) {
  // Skip auth for certain routes
  const publicRoutes = [
    '/health',
    '/api/auth/login',
    '/api/auth/register'
  ];

  if (publicRoutes.includes(request.url)) {
    return;
  }

  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
