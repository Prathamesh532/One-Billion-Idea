
# Inventory & Customer Service Backend

The Inventory Service is a NestJS-based backend application that provides product and order management functionality with GraphQL API, MongoDB persistence, and RabbitMQ event streaming. It serves as a core component for e-commerce or inventory management systems.
The Customer Service is a NestJS-based backend application that provides customer management, authentication, and order history tracking functionality with GraphQL API, MongoDB persistence, and RabbitMQ event integration. It serves as a core component for e-commerce or customer relationship management systems.

## Features

- Product Management: CRUD operations for products with stock tracking
- Order Processing: Create and manage orders with status updates
- Real-time Updates: GraphQL subscriptions for order status changes
- Event-Driven Architecture: RabbitMQ integration for order events
- Data Validation: Comprehensive DTO validation with class-validator
- Type Safety: Strongly typed with TypeScript and GraphQL
- Customer Management: Full CRUD operations for customer profiles
- Authentication: JWT-based authentication with registration and login
- Order History: Track and query customer order history
- Real-time Updates: Process order events from RabbitMQ
- Customer Analytics: Order statistics and metrics
- Data Validation: Comprehensive DTO validation with class-validator
- Type Safety: Strongly typed with TypeScript and GraphQL

## Technology Stack

- Framework: NestJS
- Database: MongoDB with Mongoose
- API: GraphQL (Apollo Server)
- Authentication: JWT with Passport
- Messaging: RabbitMQ
- Validation: class-validator
- Security: bcrypt for password hashing

### inventory-service/

    ├── src/
    │   ├── modules/
    │   │   ├── products/          # Product management module
    │   │   ├── orders/            # Order processing module
    │   │   └── rabbitmq/          # RabbitMQ integration
    │   ├── common/                # Shared types and enums
    │   ├── app.module.ts          # Root application module
    │   └── main.ts                # Application entry point
    ├── package.json               # Project dependencies
    ├── tsconfig.json              # TypeScript configuration
    ├── nest-cli.json              # NestJS CLI configuration
    └── .env                       # Environment variables

### customer-service/

    ├── src/
    │   ├── modules/
    │   │   ├── customers/          # Customer management module
    │   │   ├── auth/               # Authentication services
    │   │   └── rabbitmq/           # RabbitMQ integration
    │   ├── common/                 # Shared types, decorators, and interfaces
    │   ├── app.module.ts           # Root application module
    │   └── main.ts                 # Application entry point
    ├── package.json               # Project dependencies
    ├── tsconfig.json              # TypeScript configuration
    ├── nest-cli.json              # NestJS CLI configuration
    └── .env                       # Environment variables

## Set up environment variables:

    MONGODB_URI=mongodb://localhost:27017/inventory_db
    RABBITMQ_URL=amqp://localhost:5672
    PORT=3001

## GraphQL Schema

### Product Operations

#### Queries

- products: Get all active products
- product(id: ID!): Get a product by ID

#### Mutations

- createProduct(createProductDto: CreateProductDto!): Create a new product
- updateProduct(id: ID!, updateProductDto: UpdateProductDto!): Update a product
- removeProduct(id: ID!): Soft delete a product (sets isActive to false)

### Order Operations

#### Queries

- orders: Get all orders
- order(id: ID!): Get an order by ID

#### Mutations

- createOrder(createOrderDto: CreateOrderDto!): Create a new order.
- updateOrderStatus(id: ID!, status: OrderStatus!): Update order status.

### Authentication

#### Mutations

- register(createCustomerDto: CreateCustomerDto!): Register a new customer
- login(loginCustomerDto: LoginCustomerDto!): Authenticate and get JWT token

### Customer Operations

#### Queries

- customers: Get all active customers (requires authentication)
- customer(id: ID!): Get a customer by ID (requires authentication)
- me: Get current authenticated customer's profile (requires authentication)

#### Mutations

- updateCustomer(id: ID!, updateCustomerDto: UpdateCustomerDto!): Update customer profile (requires authentication)
- updateProfile(updateCustomerDto: UpdateCustomerDto!): Update current customer's profile (requires authentication)
- removeCustomer(id: ID!): Soft delete a customer (sets isActive to false, requires authentication)

## Authentication Flow

1. Client sends registration/login request
2. Server validates credentials
3. If valid, server generates JWT token with customer payload
4. Client stores token and includes it in Authorization header for subsequent requests
5. Protected routes verify token using JWT strategy

## Event Flow

#### 1. When an order is created:

    - Product stock is checked and updated
    - Order is saved to MongoDB
    - Order event is published to RabbitMQ
    - Subscription update is sent to connected clients

#### 2. When an order event is received from RabbitMQ:

    - Order history record is created/updated
    - Customer statistics are updated

## Database Schema

### Customer

- firstName: String (required)
- lastName: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- phone: String (optional)
- address: String (optional)
- city: String (optional)
- country: String (optional)
- zipCode: String (optional)
- isActive: Boolean (default: true)

### Product

- name: String (required)
- description: String (required)
- price: Number (required)
- stock: Number (required, default: 0)
- category: String (required)
- imageUrl: String (optional)
- isActive: Boolean (default: true)

### Order
- customerId: String (required)
- items: Array of OrderItem (required)
    - productId: String (required)
    - productName: String (required)
    - quantity: Number (required)
    - price: Number (required)
- totalAmount: Number (required)
- status: OrderStatus enum (default: PENDING)
- shippingAddress: String (optional)

---
# Frontend

This is a Next.js-based frontend application for an e-commerce platform with customer and admin interfaces. The application features product listings, shopping cart functionality, order management, and user authentication.

## Project Structure

    my-app/
    ├── components/                  # Reusable UI components
    │   ├── AdminLayout.js           # Admin area layout component
    │   ├── Navbar.js                # Main navigation component
    │   ├── ProductForm.jsx          # Product form component
    ├── contexts/                    # React context providers
    │   ├── OrderStatusContext.js    # Order status management
    │   ├── CartContext.js           # Shopping cart management
    │   ├── AuthContext.js           # Authentication state
    ├── hooks/                       # Custom React hooks
    │   └── useOrderWebSocket.js     # WebSocket for real-time order updates
    ├── lib/                         # Library and utility functions
    │   ├── graphql/                 # GraphQL client setup
    │   │   └── apollo-client.js    
    │   └── queries.js               # GraphQL query definitions
    ├── pages/                       # Next.js page routes
    │   ├── admin/                   # Admin area pages
    │   │   ├── customers.js        
    │   │   ├── dashboard.js        
    │   │   ├── orders.js          
    │   │   └── products.js        
    │   ├── customer/                # Customer area pages
    │   │   ├── cart.js            
    │   │   ├── orders.js          
    │   │   ├── products.js        
    │   │   └── profile.js         
    │   ├── _app.jsx                # Custom App component
    │   ├── _document.js            # Custom Document component
    │   ├── index.jsx               # Home page
    │   ├── login.js                # Login page
    │   └── register.js             # Registration page
    ├── utils/                      # Utility functions
    │   └── auth.js                 # Authentication helpers

## Key Features

### 1. Authentication System
- JWT-based authentication
- Protected routes for admin/customer areas
- Login/registration forms
- Auth context for global state management

### 2. Product Management
- Product listing with filtering/sorting
- Product detail pages
- Admin product CRUD operations
- Responsive product cards

### 3. Shopping Cart
- Add to cart functionality
- Remove from cart functionality
- Quantity adjustment
- Persistent cart storage

### 4. Order Processing
- Order placement flow
- Order history tracking
- Real-time status updates via WebSocket
- Admin order management

### 5. Admin Dashboard
- Product inventory
- Order processing

## Page Routing

- / - Homepage with featured products
- /login - User authentication
- /register - New user registration
- /products - Product listings
- /products/[id] - Single product view
- /customer/cart - Shopping cart
- /customer/orders - Order history
- /customer/profile - Account management
- /admin/products - Product management
- /admin/orders - Order processing
