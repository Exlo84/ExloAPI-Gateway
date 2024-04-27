const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Exloapi Backend API',
      version: '1.0.0',
      description: 'This is the Swagger UI documentation for the Exloapi Backend.',
    },
    servers: [
      {
        url: 'http://192.168.1.208:3001', // INPUT_REQUIRED {Please update the URL to match your server's address}
      },
    ],
    components: {
      schemas: {
        LLMEntry: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'LLM entry ID'
            },
            base_url: {
              type: 'string',
              description: 'Base URL of the LLM'
            },
            api_key: {
              type: 'string',
              description: 'API Key for the LLM'
            },
            model: {
              type: 'string',
              description: 'Model identifier for the LLM'
            },
            label: {
              type: 'string',
              description: 'User-defined label for the LLM entry'
            },
            isActive: {
              type: 'boolean',
              description: 'Indicates if the LLM entry is active'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    paths: {
      '/api/v1/llmEntries': {
        get: {
          summary: 'List all LLM entries',
          responses: {
            '200': {
              description: 'A list of LLM entries',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/LLMEntry'
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Add a new LLM entry',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LLMEntry'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'LLM entry created'
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            },
            '500': {
              description: 'Server error'
            }
          }
        }
      },
      // Add or modify other paths as needed
    }
  },
  apis: [path.join(__dirname, '..', 'llmRoutes.js')], // Make sure this path correctly references your route definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;