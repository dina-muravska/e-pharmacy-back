/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a user
 *     description: Creates a user and session, then sets accessToken, refreshToken, and sessionId cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *           example:
 *             name: Alex Morgan
 *             email: alex@example.com
 *             phone: '+15551234567'
 *             password: Pharmacy2026
 *     responses:
 *       '201':
 *         description: User created; secure HTTP-only session cookies are set.
 *         headers:
 *           Set-Cookie:
 *             description: Sets accessToken, refreshToken, and sessionId as HTTP-only, Secure, SameSite=None cookies.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *             example:
 *               status: 201
 *               message: Successfully registered user!
 *               data:
 *                 id: 66a100000000000000000001
 *                 name: Alex Morgan
 *                 email: alex@example.com
 *                 phone: '+15551234567'
 *       '400':
 *         description: Invalid request or email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidRequest:
 *                 value:
 *                   statusCode: 400
 *                   error: Bad Request
 *                   message: '"email" must be a valid email'
 *               emailInUse:
 *                 value:
 *                   message: Email in use
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/user/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in
 *     description: Verifies credentials, creates a session, and sets secure HTTP-only session cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: alex@example.com
 *             password: Pharmacy2026
 *     responses:
 *       '200':
 *         description: Login succeeded; accessToken, refreshToken, and sessionId cookies are set.
 *         headers:
 *           Set-Cookie:
 *             description: Sets HTTP-only, Secure, SameSite=None session cookies.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *             example:
 *               status: 200
 *               message: Successfully logged in an user!
 *               data:
 *                 id: 66a100000000000000000001
 *                 name: Alex Morgan
 *                 email: alex@example.com
 *       '400':
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '401':
 *         description: Email or password is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Invalid credentials
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/user/logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Log out
 *     description: Deletes the current session if present and clears the three session cookies.
 *     security:
 *       - sessionIdCookie: []
 *         accessTokenCookie: []
 *     responses:
 *       '204':
 *         description: Session ended; no response body.
 *       '401':
 *         description: Session credentials are missing, expired, or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/user/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh the session
 *     description: Requires sessionId and refreshToken cookies; replaces the session and refreshes all session cookies.
 *     security:
 *       - sessionIdCookie: []
 *         refreshTokenCookie: []
 *     responses:
 *       '200':
 *         description: Session refreshed; new session cookies are set.
 *         headers:
 *           Set-Cookie:
 *             description: Sets new accessToken, refreshToken, and sessionId cookies.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionRefreshResponse'
 *       '401':
 *         description: Required cookies are missing, session does not exist, or refresh token has expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingCredentials:
 *                 value:
 *                   message: Missing session credentials
 *               expired:
 *                 value:
 *                   message: Session token expired
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/user/user-info:
 *   get:
 *     tags: [Authentication]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - sessionIdCookie: []
 *         accessTokenCookie: []
 *     responses:
 *       '200':
 *         description: Profile returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfoResponse'
 *             example:
 *               status: 200
 *               message: Successfully found user info!
 *               data:
 *                 name: Alex Morgan
 *                 email: alex@example.com
 *       '401':
 *         description: Session credentials are missing, expired, or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List products
 *     description: Returns a filtered, sorted, paginated product list. Filters accepted by request validation are listed below.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Case-insensitive substring search in product title; empty string is allowed.
 *         example: vitamin
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Exact brand match.
 *         example: HealthCo
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Exact tag filter. The controller queries the tags field, which is not declared in the current Product model.
 *         example: supplement
 *       - in: query
 *         name: rx
 *         schema:
 *           type: boolean
 *         description: Match rxRequired.
 *         example: false
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         example: 5
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         example: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, '-price', title, '-title', createdAt, '-createdAt']
 *           default: createdAt
 *     responses:
 *       '200':
 *         description: Product results with pagination metadata.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             example:
 *               status: 200
 *               message: Successfully found products!
 *               data:
 *                 - _id: 66a100000000000000000010
 *                   title: Vitamin C 500 mg
 *                   image: https://example.com/vitamin-c.jpg
 *                   slug: vitamin-c-500-mg
 *                   brand: HealthCo
 *                   form: tablet
 *                   price: 12.5
 *                   stock: 40
 *                   rxRequired: false
 *                   description: Vitamin C supplement.
 *               page: 1
 *               limit: 12
 *               totalItems: 1
 *               totalPages: 1
 *       '400':
 *         description: One or more query parameters failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: MongoDB ObjectId.
 *         example: 66a100000000000000000010
 *     responses:
 *       '200':
 *         description: Product found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *             example:
 *               status: 200
 *               message: Successfully found product!
 *               data:
 *                 _id: 66a100000000000000000010
 *                 title: Vitamin C 500 mg
 *                 image: https://example.com/vitamin-c.jpg
 *                 price: 12.5
 *                 stock: 40
 *                 rxRequired: false
 *       '400':
 *         description: The id is not a 24-character hexadecimal ObjectId.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '404':
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: Product not found
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/stores:
 *   get:
 *     tags: [Stores]
 *     summary: List stores
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       '200':
 *         description: Store results with pagination metadata.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreListResponse'
 *             example:
 *               status: 200
 *               message: Successfully found stores list!
 *               data:
 *                 - _id: 66a100000000000000000020
 *                   name: Downtown Pharmacy
 *                   adress: 10 Main Street
 *                   phone: '+15551234567'
 *                   rating: 4.5
 *                   isActive: true
 *                   location:
 *                     type: Point
 *                     coordinates: -73.9857
 *               page: 1
 *               limit: 20
 *               totalItems: 1
 *               totalPages: 1
 *       '400':
 *         description: One or more query parameters failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/stores/nearest:
 *   get:
 *     tags: [Stores]
 *     summary: Find nearest stores
 *     parameters:
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude used in the GeoJSON point [longitude, latitude].
 *         example: -73.9857
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude used in the GeoJSON point [longitude, latitude].
 *         example: 40.7484
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *           minimum: 100
 *           maximum: 50000
 *           default: 5000
 *         description: Maximum distance in meters.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       '200':
 *         description: Nearest stores within the requested maximum distance.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NearestStoresResponse'
 *       '400':
 *         description: Missing or invalid query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '500':
 *         description: Unexpected server error, including a database geospatial query failure.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/customer-reviews:
 *   get:
 *     tags: [Customer reviews]
 *     summary: List reviews for a product
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: MongoDB ObjectId of the product.
 *         example: 66a100000000000000000010
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       '200':
 *         description: Reviews with the reviewer's name populated and pagination metadata.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewListResponse'
 *             example:
 *               status: 200
 *               message: Successfully found customer reviews!
 *               data:
 *                 - _id: 66a100000000000000000030
 *                   userId:
 *                     _id: 66a100000000000000000001
 *                     name: Alex Morgan
 *                   productID: 66a100000000000000000010
 *                   rating: 5
 *                   comment: Helpful and easy to use.
 *               page: 1
 *               limit: 10
 *               totalItems: 1
 *               totalPages: 1
 *       '400':
 *         description: The productId or pagination parameters failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get the authenticated user's cart
 *     description: Creates and returns an empty cart when the user has no cart yet.
 *     security:
 *       - sessionIdCookie: []
 *         accessTokenCookie: []
 *     responses:
 *       '200':
 *         description: Cart returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *             example:
 *               status: 200
 *               message: Successfully fetched cart items!
 *               data:
 *                 _id: 66a100000000000000000040
 *                 userID: 66a100000000000000000001
 *                 items:
 *                   - priductID:
 *                       _id: 66a100000000000000000010
 *                       title: Vitamin C 500 mg
 *                       price: 12.5
 *                     qty: 2
 *                     priceAtAdd: 12.5
 *       '401':
 *         description: Session credentials are missing, expired, or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/cart/update:
 *   put:
 *     tags: [Cart]
 *     summary: Replace cart items
 *     description: Replaces the current user's item list; each item's priceAtAdd is taken from the product record, or zero if it is not found.
 *     security:
 *       - sessionIdCookie: []
 *         accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartRequest'
 *           example:
 *             items:
 *               - productId: 66a100000000000000000010
 *                 qty: 2
 *     responses:
 *       '200':
 *         description: Cart replaced and returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *             example:
 *               status: 200
 *               message: Cart successfully updated!
 *               data:
 *                 _id: 66a100000000000000000040
 *                 userID: 66a100000000000000000001
 *                 items:
 *                   - priductID: 66a100000000000000000010
 *                     qty: 2
 *                     priceAtAdd: 12.5
 *       '400':
 *         description: Items must contain at least one item; productId must be a 24-character hexadecimal ObjectId; qty must be an integer from 0 to 999.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '401':
 *         description: Session credentials are missing, expired, or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/cart/checkout:
 *   post:
 *     tags: [Cart]
 *     summary: Check out the cart
 *     description: Clears all cart items after confirming the cart is non-empty. paymentMethod is optional and defaults to mock; clientTotal is accepted and echoed, not calculated by the server.
 *     security:
 *       - sessionIdCookie: []
 *         accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *           example:
 *             paymentMethod: mock
 *             clientTotal: 25
 *     responses:
 *       '200':
 *         description: Checkout processed and cart emptied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *             example:
 *               status: 200
 *               message: Checkout processed successfully!
 *               paymentMethod: mock
 *               clientTotal: 25
 *       '400':
 *         description: Payment details failed validation or the cart is empty.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emptyCart:
 *                 value:
 *                   status: 400
 *                   message: Cart is empty
 *               invalidRequest:
 *                 value:
 *                   statusCode: 400
 *                   error: Bad Request
 *                   message: '"paymentMethod" must be [mock]'
 *       '401':
 *         description: Session credentials are missing, expired, or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
