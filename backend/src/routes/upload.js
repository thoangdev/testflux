// Upload routes placeholder
export default async function uploadRoutes(fastify, options) {
  // POST /api/upload
  fastify.post('/', async (request, reply) => {
    // TODO: Handle file upload and processing
    return { message: 'Upload endpoint - to be implemented' };
  });

  // GET /api/upload/:id/status
  fastify.get('/:id/status', async (request, reply) => {
    // TODO: Get upload processing status
    return { message: 'Upload status endpoint - to be implemented' };
  });
}
