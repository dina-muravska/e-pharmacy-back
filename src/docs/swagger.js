import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const configuredPort = Number(process.env.PORT);
const localPort =
  Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535
    ? configuredPort
    : 3000;

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Pharmacy API',
      version: '1.0.0',
      description:
        'API documentation generated from the existing e-pharmacy backend routes.',
    },
    servers: [
      {
        url: `http://localhost:${localPort}`,
        description: 'Local development',
      },
    ],
    tags: [
      { name: 'Authentication' },
      { name: 'Products' },
      { name: 'Stores' },
      { name: 'Customer reviews' },
      { name: 'Cart' },
    ],
    components: {
      securitySchemes: {
        sessionIdCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionId',
          description: 'Session identifier set by authentication endpoints.',
        },
        accessTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description:
            'Short-lived access token set by authentication endpoints.',
        },
        refreshTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description:
            'Refresh token required with sessionId to refresh a session.',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session not found' },
          },
          required: ['message'],
        },
        ValidationError: {
          type: 'object',
          description:
            'Celebrate/Joi request validation error. The exact message depends on the invalid field.',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            error: { type: 'string', example: 'Bad Request' },
            message: { type: 'string', example: '"email" must be a valid email' },
            validation: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  source: {
                    type: 'string',
                    enum: ['body', 'headers', 'params', 'query'],
                  },
                  keys: { type: 'array', items: { type: 'string' } },
                  message: { type: 'string' },
                },
              },
              example: {
                body: {
                  source: 'body',
                  keys: ['email'],
                  message: '"email" must be a valid email',
                },
              },
            },
          },
        },
        UserSummary: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '66a100000000000000000001' },
            name: { type: 'string', example: 'Alex Morgan' },
            email: { type: 'string', format: 'email', example: 'alex@example.com' },
            phone: { type: 'string', nullable: true, example: '+15551234567' },
          },
          required: ['id', 'name', 'email'],
        },
        RegistrationRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 80, example: 'Alex Morgan' },
            email: { type: 'string', format: 'email', example: 'alex@example.com' },
            phone: {
              type: 'string',
              nullable: true,
              example: '+15551234567',
              description: 'May also be an empty string.',
            },
            password: {
              type: 'string',
              minLength: 8,
              maxLength: 110,
              pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$',
              example: 'Pharmacy2026',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alex@example.com' },
            password: { type: 'string', example: 'Pharmacy2026' },
          },
        },
        AuthSuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully logged in an user!' },
            data: { $ref: '#/components/schemas/UserSummary' },
          },
          required: ['status', 'message', 'data'],
        },
        UserInfoResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found user info!' },
            data: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Alex Morgan' },
                email: { type: 'string', format: 'email', example: 'alex@example.com' },
              },
              required: ['name', 'email'],
            },
          },
          required: ['status', 'message', 'data'],
        },
        SessionRefreshResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully refreshed session!' },
          },
          required: ['status', 'message'],
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a100000000000000000010' },
            title: { type: 'string', example: 'Vitamin C 500 mg' },
            image: { type: 'string', example: 'https://example.com/vitamin-c.jpg' },
            slug: { type: 'string', example: 'vitamin-c-500-mg' },
            brand: { type: 'string', example: 'HealthCo' },
            form: { type: 'string', example: 'tablet' },
            price: { type: 'number', minimum: 0, example: 12.5 },
            stock: { type: 'number', example: 40 },
            storeID: {
              type: 'string',
              nullable: true,
              example: '66a100000000000000000020',
            },
            rxRequired: { type: 'boolean', example: false },
            description: { type: 'string', example: 'Vitamin C supplement.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer', example: 0 },
          },
          required: ['_id', 'title', 'image', 'price'],
        },
        Store: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a100000000000000000020' },
            name: { type: 'string', example: 'Downtown Pharmacy' },
            adress: { type: 'string', example: '10 Main Street' },
            phone: { type: 'string', example: '+15551234567' },
            rating: { type: 'number', example: 4.5 },
            isActive: { type: 'boolean', example: true },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'], example: 'Point' },
                coordinates: {
                  type: 'number',
                  example: -73.9857,
                  description: 'Documented using the current Mongoose model type.',
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer', example: 0 },
          },
          required: ['_id', 'name', 'location'],
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a100000000000000000030' },
            userId: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '66a100000000000000000001' },
                name: { type: 'string', example: 'Alex Morgan' },
              },
              required: ['_id', 'name'],
            },
            productID: { type: 'string', example: '66a100000000000000000010' },
            storeID: { type: 'string', nullable: true },
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Helpful and easy to use.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer', example: 0 },
          },
          required: ['_id', 'userId', 'productID', 'rating'],
        },
        CartItem: {
          type: 'object',
          properties: {
            priductID: {
              description: 'The field name is spelled this way in the current cart model.',
              nullable: true,
              oneOf: [
                { type: 'string', example: '66a100000000000000000010' },
                { $ref: '#/components/schemas/Product' },
              ],
            },
            qty: { type: 'integer', minimum: 0, example: 2 },
            priceAtAdd: { type: 'number', minimum: 0, example: 12.5 },
          },
          required: ['priductID', 'qty', 'priceAtAdd'],
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a100000000000000000040' },
            userID: { type: 'string', example: '66a100000000000000000001' },
            items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer', example: 0 },
          },
          required: ['items'],
        },
        ProductListResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found products!' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 12 },
            totalItems: { type: 'integer', example: 34 },
            totalPages: { type: 'integer', example: 3 },
          },
          required: ['status', 'message', 'data', 'page', 'limit', 'totalItems', 'totalPages'],
        },
        ProductResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found product!' },
            data: { $ref: '#/components/schemas/Product' },
          },
          required: ['status', 'message', 'data'],
        },
        StoreListResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found stores list!' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Store' } },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            totalItems: { type: 'integer', example: 8 },
            totalPages: { type: 'integer', example: 1 },
          },
          required: ['status', 'message', 'data', 'page', 'limit', 'totalItems', 'totalPages'],
        },
        NearestStoresResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found nearest stores!' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Store' } },
          },
          required: ['status', 'message', 'data'],
        },
        ReviewListResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully found customer reviews!' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 4 },
            totalPages: { type: 'integer', example: 1 },
          },
          required: ['status', 'message', 'data', 'page', 'limit', 'totalItems', 'totalPages'],
        },
        CartResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Successfully fetched cart items!' },
            data: { $ref: '#/components/schemas/Cart' },
          },
          required: ['status', 'message', 'data'],
        },
        UpdateCartRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['productId', 'qty'],
                properties: {
                  productId: {
                    type: 'string',
                    pattern: '^[a-fA-F0-9]{24}$',
                    example: '66a100000000000000000010',
                  },
                  qty: { type: 'integer', minimum: 0, maximum: 999, example: 2 },
                },
              },
            },
          },
        },
        CheckoutRequest: {
          type: 'object',
          properties: {
            paymentMethod: {
              type: 'string',
              enum: ['mock'],
              default: 'mock',
              example: 'mock',
            },
            clientTotal: { type: 'number', minimum: 0, example: 25 },
          },
        },
        CheckoutResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Checkout processed successfully!' },
            paymentMethod: { type: 'string', enum: ['mock'], example: 'mock' },
            clientTotal: { type: 'number', nullable: true, example: 25 },
          },
          required: ['status', 'message'],
        },
      },
    },
  },
  apis: [
    path.join(currentDirectory, 'endpoints.js'),
    path.join(currentDirectory, '../routes/*.js'),
  ],
});
