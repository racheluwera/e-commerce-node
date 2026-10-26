import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { AuthRequest } from "../types";
import { IUser, USER_ROLES, User, UserRole } from "../model/User.model";
import { IOrder, isOrderStatus, Order } from "../model/order.model";
import Product from "../model/product.model";
import { Cart } from "../model/cart.model";
import { signToken } from "../utils/jwt";

const getPagination = (query: { page?: unknown; limit?: unknown }) => {
  const page = Math.max(parseInt(String(query.page ?? "1"), 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(String(query.limit ?? "20"), 10) || 20, 1),
    100
  );

  return { page, limit, skip: (page - 1) * limit };
};

const toSafeUser = (user: IUser) => {
  const safeUser = user.toObject() as Record<string, unknown>;
  delete safeUser.password;
  delete safeUser.resetCode;
  delete safeUser.resetCodeExpiry;
  return safeUser;
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      role: "admin",
    });

    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -resetCode -resetCodeExpiry"
    );

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get admin profile" });
  }
};

export const getDashboard = async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalProducts,
      totalOrders,
      pendingOrders,
      revenueResult,
      statusBreakdown,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "PENDING" }),
      Order.aggregate<{ _id: null; total: number }>([
        { $match: { status: { $ne: "CANCELLED" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
      User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const ordersByStatus = statusBreakdown.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {}
    );

    return res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: revenueResult[0]?.total || 0,
      },
      ordersByStatus,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Failed to get dashboard data" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const filter: mongoose.QueryFilter<IUser> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -resetCode -resetCodeExpiry")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.params.id).select(
      "-password -resetCode -resetCodeExpiry"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [ordersCount, recentOrders] = await Promise.all([
      Order.countDocuments({ user: user._id }),
      Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(10),
    ]);

    return res.status(200).json({ user, ordersCount, recentOrders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;

    if (!(USER_ROLES as readonly string[]).includes(role)) {
      return res.status(400).json({
        message: `Role must be one of: ${USER_ROLES.join(", ")}`,
      });
    }

    if (req.params.id === req.userId && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role as UserRole;
    await user.save();

    return res.status(200).json({
      message: "User role updated",
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user role" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await Cart.deleteOne({ user: user._id });
    await user.deleteOne();

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter: mongoose.QueryFilter<IOrder> = {};

    if (typeof req.query.status === "string" && req.query.status) {
      if (!isOrderStatus(req.query.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      filter.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get orders" });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get order" });
  }
};
