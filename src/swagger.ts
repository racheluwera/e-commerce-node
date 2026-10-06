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
        url: `http://localhost:${PORT}`,
        description: "Local development server",
      },
    ],

    tags: [
      { name: "Auth", description: "User registration and JWT login" },
      { name: "Products", description: "Product catalogue (JWT protected)" },
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
          required: ["name", "category", "price"],
          properties: {
            name: { type: "string", example: "Laptop" },
            category: { type: "string", example: "electronics" },
            price: { type: "number", format: "double", example: 850000 },
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
      },
    },
  },

  apis: [glob("**/*.ts"), glob("**/*.js"), `!${glob("**/*.d.ts")}`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;