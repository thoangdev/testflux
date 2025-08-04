// Users routes placeholder
export default async function usersRoutes(fastify, options) {
  // GET /api/users
  fastify.get('/', async (request, reply) => {
    // TODO: Get all users (admin only)
    return { message: 'Users endpoint - to be implemented' };
  });

  // POST /api/users
  fastify.post('/', async (request, reply) => {
    // TODO: Create new user (admin only)
    return { message: 'Create user endpoint - to be implemented' };
  });

  // PUT /api/users/:id
  fastify.put('/:id', async (request, reply) => {
    // TODO: Update user (admin only)
    return { message: 'Update user endpoint - to be implemented' };
  });

  // DELETE /api/users/:id
  fastify.delete('/:id', async (request, reply) => {
    // TODO: Delete user (admin only)
    return { message: 'Delete user endpoint - to be implemented' };
  });
}
