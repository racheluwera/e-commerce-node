import { Response } from "express";
import { AuthRequest } from "../types";
import { Cart } from "../model/cart.model";
import { Order } from "../model/order.model";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const order = await Order.create({
      user: req.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: "PENDING",
    });

    // Clear cart after order is placed
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get orders" });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get order" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING orders can be cancelled" });

    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel order" });
  }
};
