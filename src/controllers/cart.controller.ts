import { Response } from "express";
import { AuthRequest } from "../types";
import { Cart } from "../model/cart.model";
import Product from "../model/product.model";

const calcTotal = (items: { price: number; quantity: number }[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(200).json({ items: [], totalPrice: 0 });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get cart" });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ message: "productId is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((i) => i.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id as any,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity,
      });
    }

    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i._id?.toString() === itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    return res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart item" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i._id?.toString() !== itemId);
    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
