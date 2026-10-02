import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config/database";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { User } from "./model/User.model";
import bcrypt from "bcryptjs";
import { JsonWebTokenError } from "jsonwebtoken";
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Laptop",
      price: 850000,
      quantity: 10,
    },
    {
      id: 2,
      name: "Mouse",
      price: 15000,
      quantity: 20,
    },
  ]);
});

// Swagger docs
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 */
app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Laptop",
      price: 850000,
      quantity: 10,
    },
    {
      id: 2,
      name: "Mouse",
      price: 15000,
      quantity: 20,
    },
  ]);
});
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               price:
 *                 type: number
 *                 example: 850000
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
 */
app.post("/products", (req, res) => {
  const product = req.body;

  res.status(201).json({
    message: "Product created successfully",
    product: product,
  });
});
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  res.json({
    id: id,
    name: "Laptop",
    price: 850000,
    quantity: 10,
  });
});
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               price:
 *                 type: number
 *                 example: 900000
 *               quantity:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  res.json({
    message: "Product updated successfully",
    product: {
      id: id,
      ...req.body,
    },
  });
});
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  res.json({
    message: `Product ${id} deleted successfully`,
  });
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a user account and saves it to MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rachel
 *               email:
 *                 type: string
 *                 example: rachel@gmail.com
 *               password:
 *                 type: string
 *                 example: "MyPassword123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered or invalid input
 *       500:
 *         description: Server error
 */
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name and email are required; password must be at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This email is already registered.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Checks credentials and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: rachel@gmail.com
 *               password:
 *                 type: string
 *                 example: "MyPassword123!"
 *     responses:
 *       200:
 *         description: Login successful; returns a JWT token
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = JsonWebTokenError.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});
// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API is running" });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
// const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
});