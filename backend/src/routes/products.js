// Products routes placeholder
export default async function productRoutes(fastify, options) {
  // GET /api/products
  fastify.get('/', async (request, reply) => {
    // TODO: Get all products
    return { message: 'Get products endpoint - to be implemented' };
  });

  // POST /api/products
  fastify.post('/', async (request, reply) => {
    // TODO: Create new product
    return { message: 'Create product endpoint - to be implemented' };
  });

  // GET /api/products/:id
  fastify.get('/:id', async (request, reply) => {
    // TODO: Get specific product
    return { message: 'Get product endpoint - to be implemented' };
  });

  // PUT /api/products/:id
  fastify.put('/:id', async (request, reply) => {
    // TODO: Update product
    return { message: 'Update product endpoint - to be implemented' };
  });

  // DELETE /api/products/:id
  fastify.delete('/:id', async (request, reply) => {
    // TODO: Delete product
    return { message: 'Delete product endpoint - to be implemented' };
  });
}
