/** OpenAPI path definitions shown in the Swagger docs. Add an entry for each new endpoint. */
export const openApiPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Check that the API is running',
      responses: {
        200: {
          description: 'The API is up',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  message: { type: 'string', example: 'Jollivo API is running' }
                }
              }
            }
          }
        }
      }
    }
  }
};
