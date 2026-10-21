# E-Pharmacy Backend

An Express and MongoDB backend for an online pharmacy. The current API provides account registration and cookie-based sessions, product and store browsing, customer review listing, and basic cart and mock-checkout operations.

## Live API Documentation

Explore the deployed API in [Swagger UI](https://e-pharmacy-back-wx2u.onrender.com/api-docs/).

Production backend base URL: **[https://e-pharmacy-back-wx2u.onrender.com](https://e-pharmacy-back-wx2u.onrender.com)**

## Features

- User registration, login, logout, session refresh, and authenticated profile lookup.
- Product listing with title, brand, tag, prescription requirement, price, sorting, and pagination filters.
- Product lookup by MongoDB ObjectId.
- Paginated store listing and nearest-store search.
- Paginated customer reviews for a product.
- Per-user cart retrieval and replacement, plus a mock checkout that empties the cart.
- Swagger UI generated from the API's OpenAPI 3.0 documentation.

The codebase also defines Mongoose models for orders, but currently has no order routes or order controller endpoints. Checkout is a mock operation; it does not create an order or contact a payment provider.

## Technology stack

- Node.js with ES modules.
- Express 5.
- MongoDB with Mongoose.
- Joi and Celebrate for request validation.
- Cookie Parser for session cookies.
- `swagger-jsdoc` and `swagger-ui-express` for API documentation.
- Helmet, CORS, and Pino HTTP logging middleware.
- Nodemon for the development server.

## Prerequisites

- Node.js and npm versions compatible with the dependencies in `package-lock.json`.
- A reachable MongoDB instance (local or managed).

## Installation and configuration

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root. Do not commit database credentials or other secrets.

   ```dotenv
   MONGO_URL=<your-mongodb-connection-uri>
   PORT=3000
   NODE_ENV=development
   ```

   - `MONGO_URL` is required. It is passed directly to `mongoose.connect()`. Use a local MongoDB URI or your own MongoDB connection URI, replacing the placeholder without sharing or committing credentials.
   - `PORT` is optional and defaults to `3000`. When set, it must be a numeric port with no trailing punctuation.
   - `NODE_ENV` is optional. Set it to `production` in production deployments; unexpected server errors then return a generic message, and Swagger uses the production API base URL.
   - `OPENAPI_SERVER_URL` is optional. Set it only when Swagger should use a custom API base URL; it must be the API origin/base URL without `/api-docs`.

3. Ensure MongoDB is running and reachable using `MONGO_URL`. The server connects to MongoDB before it starts listening for HTTP requests; it exits if the connection attempt fails.

## Start the server

Start in development mode with automatic restarts:

```bash
npm run dev
```

The server listens at `http://localhost:3000` by default. If you set `PORT`, use that port instead. To run without Nodemon, use:

```bash
node src/server.js
```

## API documentation

Open local Swagger UI after starting the backend at **[http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)**. If you set `PORT`, replace `3000` with that port. Locally, the OpenAPI server URL uses `http://localhost:<PORT>` (default `http://localhost:3000`). In production (`NODE_ENV=production`, or on Render), it uses `https://e-pharmacy-back-wx2u.onrender.com`. `OPENAPI_SERVER_URL`, if set, overrides either default. The OpenAPI server URL is the backend base URL and does not include `/api-docs`.

The UI is suitable for exploring the endpoint definitions and trying public endpoints. The service sets session cookies with `HttpOnly`, `Secure`, and `SameSite=None`; browsers will not store or send these cookies over plain HTTP. To test authenticated browser requests, use an HTTPS development setup. No bearer-token authentication is implemented.

## API structure

All API routes are mounted in `src/server.js`. The route paths below include their mounted prefixes.

### Authentication

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/api/user/register` | Public | Creates an account and session; sets session cookies. |
| `POST` | `/api/user/login` | Public | Verifies credentials and creates a session; sets session cookies. |
| `GET` | `/api/user/logout` | `sessionId` and `accessToken` cookies | Deletes the current session when found, clears the cookies, and returns `204`. |
| `POST` | `/api/user/refresh` | `sessionId` and `refreshToken` cookies | Validates and rotates the session, then sets new session cookies. |
| `GET` | `/api/user/user-info` | `sessionId` and `accessToken` cookies | Returns the authenticated user's name and email. |

### Products, stores, and reviews

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Public | Lists products. Optional query parameters: `q`, `brand`, `tag`, `rx`, `minPrice`, `maxPrice`, `page`, `limit`, and `sort`. `tag` is accepted by validation, but the controller filters a `tags` field that is not defined by the current Product model. |
| `GET` | `/api/products/:id` | Public | Returns a product by its 24-character hexadecimal MongoDB ObjectId. |
| `GET` | `/api/stores` | Public | Lists stores with `page` and `limit` pagination. |
| `GET` | `/api/stores/nearest` | Public | Finds nearby stores. Requires numeric `lng` and `lat`; accepts `max` distance in meters (100–50,000, default 5,000) and `limit` (1–50, default 10). |
| `GET` | `/api/customer-reviews` | Public | Lists reviews for the required `productId` ObjectId, with `page` and `limit` pagination. |

### Cart

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/api/cart` | `sessionId` and `accessToken` cookies | Returns the user's cart, creating an empty cart if none exists. |
| `PUT` | `/api/cart/update` | `sessionId` and `accessToken` cookies | Replaces the cart items. Requires a non-empty `items` array; each item has a 24-character hexadecimal `productId` and integer `qty` from 0 to 999. |
| `POST` | `/api/cart/checkout` | `sessionId` and `accessToken` cookies | Rejects an empty cart, otherwise empties it. Optional JSON fields: `paymentMethod` (only `mock`, default `mock`) and non-negative `clientTotal` (echoed, not calculated or charged). |

For exact request schemas, defaults, examples, and responses, see the Swagger UI.

## Authentication flow

Authentication uses cookies, not an `Authorization: Bearer` header:

- Registration and login set `accessToken`, `refreshToken`, and `sessionId` cookies.
- `accessToken` is valid for 15 minutes; `refreshToken` and `sessionId` cookies are set for one day.
- Protected routes validate `sessionId` together with `accessToken`.
- Refresh requires `sessionId` and `refreshToken`. An expired refresh token invalidates the session; a successful refresh deletes the old session and creates a new one.
- Logout is an authenticated `GET`; it deletes the current session when possible and clears all three cookies, returning no response body (`204`).
- Cookies are HTTP-only, secure, and use `SameSite=None`.

### Current cookie and local-development limitations

- The session-cookie helper does not set a `Path`; browsers derive the cookie path from the authentication URL (normally `/api/user`). As a result, a browser may not send those cookies to protected routes under `/api/cart`. This is existing behavior and is not changed by the documentation work.
- The cookies are `Secure`, so a browser will not retain them over the default plain-HTTP local URL. Use HTTPS when testing authentication in a browser.
- The app uses default `cors()` configuration and does not enable credentialed cross-origin requests. A separate frontend origin therefore cannot rely on these cookies without compatible CORS/cookie configuration.

## Request and response examples

### Register

```bash
curl -i http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+15551234567",
    "password": "Pharmacy2026"
  }'
```

The password must be 8–110 characters and contain at least one uppercase letter, lowercase letter, and digit. Registration returns `201` and a response shaped like:

```json
{
  "status": 201,
  "message": "Successfully registered user!",
  "data": {
    "id": "66a100000000000000000001",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+15551234567"
  }
}
```

Session cookies are returned in `Set-Cookie` headers; cookie values are intentionally omitted from this example.

### List products

```bash
curl "http://localhost:3000/api/products?q=vitamin&page=1&limit=12&sort=price"
```

A successful list response includes product documents and pagination metadata:

```json
{
  "status": 200,
  "message": "Successfully found products!",
  "data": [
    {
      "_id": "66a100000000000000000010",
      "title": "Vitamin C 500 mg",
      "image": "https://example.com/vitamin-c.jpg",
      "price": 12.5,
      "stock": 40,
      "rxRequired": false
    }
  ],
  "page": 1,
  "limit": 12,
  "totalItems": 1,
  "totalPages": 1
}
```

Examples use illustrative data only; actual product and store results depend on the MongoDB contents.

## Errors and validation

- Invalid request data is validated by Joi/Celebrate and produces a `400` validation response.
- Authentication failures produce `401`.
- A product lookup for a valid but unknown ObjectId returns `404`.
- Unknown routes return `404` with a `Route not found` message.
- Unexpected failures return `500`; the message is generic in production.
- Checkout returns `400` with `Cart is empty` when there are no items.

## Tests

There is no automated test suite configured. The current `npm test` script is a placeholder that prints `Error: no test specified` and exits with a failure status. Use Swagger UI to inspect and exercise the documented endpoints against a configured development database.
