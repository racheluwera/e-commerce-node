import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.router";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config/database";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger UI + raw JSON spec
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: "E-Commerce API Docs" })
);

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Confirms the API server is up.
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-Commerce API is running"
 */
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});