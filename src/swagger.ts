import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const PORT = process.env.PORT || 5000;

const glob = (pattern: string): string =>
  path.resolve(__dirname, pattern).split(path.sep).join("/");

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description:
        "REST API for the e-commerce backend.\n\n" +
        "**Authentication** — call `POST /api/auth/login` to get a JWT, then click " +
        "`Authorize` in the top-right corner and paste the token. Every `/api/products` " +
        "endpoint requires that token.",
    },

    servers: [
      {
        url: process.env.BASE_URL,
        description: "Local development server",
      },
    ],

    tags: [
      { name: "Auth", description: "User registration and JWT login" },
      { name: "Products", description: "Product catalogue (JWT protected)" },
      {
        name: "Admin",
        description: "Admin-only management: dashboard, users and orders",
      },
      { name: "Health", description: "Service health check" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste the `token` returned by `POST /api/auth/login`.",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Product Not Found" },
          },
        },

        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "66f0a1b2c3d4e5f60718293a" },
            name: { type: "string", example: "Rachel" },
            email: { type: "string", format: "email", example: "rachel@gmail.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Rachel" },
            email: { type: "string", format: "email", example: "rachel@gmail.com" },
            password: { type: "string", format: "password", example: "MyPassword123!" },
          },
        },

        RegisterResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "User registered successfully" },
            user: { $ref: "#/components/schemas/User" },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "rachel@gmail.com" },
            password: { type: "string", format: "password", example: "MyPassword123!" },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Login successful" },
            token: {
              type: "string",
              description: "JWT. Send it as `Authorization: Bearer <token>`.",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: { $ref: "#/components/schemas/User" },
          },
        },

        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66f0a1b2c3d4e5f60718293a" },
            name: { type: "string", example: "Laptop" },
            category: { type: "string", example: "electronics" },
            price: { type: "number", format: "double", example: 850000 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        CreateProductRequest: {
          type: "object",
          required: ["name", "category", "price", "image"],
          properties: {
            name: { type: "string", example: "Laptop" },
            category: { type: "string", example: "electronics" },
            price: { type: "number", format: "double", example: 850000 },
            image: { type: "string", format: "binary", description: "Product image file" },
          },
        },

        UpdateProductRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Laptop Pro" },
            category: { type: "string", example: "electronics" },
            price: { type: "number", format: "double", example: 900000 },
          },
        },

        ProductResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Product Created" },
            product: { $ref: "#/components/schemas/Product" },
          },
        },

        ProductListResponse: {
          type: "array",
          items: { $ref: "#/components/schemas/Product" },
        },

        AdminLoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Admin login successful" },
            token: {
              type: "string",
              description: "JWT. Send it as `Authorization: Bearer <token>`.",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: { $ref: "#/components/schemas/User" },
          },
        },

        UpdateUserRoleRequest: {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["user", "admin"], example: "admin" },
          },
        },

        UserListResponse: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            total: { type: "integer", example: 42 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            totalPages: { type: "integer", example: 3 },
          },
        },

        OrderItem: {
          type: "object",
          properties: {
            product: { type: "string", example: "66f0a1b2c3d4e5f60718293a" },
            name: { type: "string", example: "Laptop" },
            imageUrl: {
              type: "string",
              format: "uri",
              example: "https://res.cloudinary.com/demo/image/upload/laptop.jpg",
            },
            price: { type: "number", format: "double", example: 850000 },
            quantity: { type: "integer", example: 1 },
          },
        },

        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66f0a1b2c3d4e5f60718293a" },
            user: {
              type: "object",
              properties: {
                _id: { type: "string", example: "66f0a1b2c3d4e5f60718293a" },
                name: { type: "string", example: "Rachel" },
                email: { type: "string", format: "email", example: "rachel@gmail.com" },
              },
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            totalPrice: { type: "number", format: "double", example: 850000 },
            status: {
              type: "string",
              enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
              example: "PENDING",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        OrderListResponse: {
          type: "object",
          properties: {
            orders: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            total: { type: "integer", example: 42 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            totalPages: { type: "integer", example: 3 },
          },
        },

        AdminDashboard: {
          type: "object",
          properties: {
            stats: {
              type: "object",
              properties: {
                totalUsers: { type: "integer", example: 42 },
                totalAdmins: { type: "integer", example: 1 },
                totalProducts: { type: "integer", example: 12 },
                totalOrders: { type: "integer", example: 18 },
                pendingOrders: { type: "integer", example: 3 },
                totalRevenue: { type: "number", format: "double", example: 2450000 },
              },
            },
            ordersByStatus: {
              type: "object",
              additionalProperties: { type: "integer" },
              example: { PENDING: 3, PROCESSING: 2, SHIPPED: 5, DELIVERED: 8, CANCELLED: 0 },
            },
            recentOrders: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            recentUsers: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },
    },
  },

  apis: [glob("**/*.ts"), glob("**/*.js"), `!${glob("**/*.d.ts")}`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;