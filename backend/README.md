# InGraviton Backend

Node.js + Express + MongoDB backend API for InGraviton Drone Solutions.

## Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Start MongoDB** (make sure it's running locally or update MONGODB_URI)

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories with counts
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update` - Update cart item (protected)
- `DELETE /api/cart/remove/:productId` - Remove item (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status (admin)

### Custom Builds
- `POST /api/custom-build` - Submit custom build request
- `GET /api/custom-build/my-requests` - Get user's requests (protected)
- `GET /api/custom-build/:id` - Get request by ID (protected)
- `GET /api/custom-build` - Get all requests (admin)
- `PUT /api/custom-build/:id` - Update request (admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/newsletter` - Get subscribers (admin)

## Test Credentials

After seeding:
- **Admin:** admin@ingraviton.com / admin123
- **User:** test@user.com / user123

## Example API Usage

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@user.com","password":"user123"}'

# Get products
curl http://localhost:5000/api/products

# Subscribe newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"example@email.com"}'
```
