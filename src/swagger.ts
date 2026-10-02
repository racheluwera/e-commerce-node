import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "e-commerce API",
      version: "1.0.0",
      description: "API documentation for my e-commerce project",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },

  apis: ["./src/index.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;