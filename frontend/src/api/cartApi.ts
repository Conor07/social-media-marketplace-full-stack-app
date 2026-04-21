import axios from "axios";
import type { CartItem } from "../types";

export const getCartItems = async (): Promise<CartItem[]> => {
  const res = await axios.get("/cart");
  return res.data;
};

export const createCartItem = async (item: CartItem): Promise<CartItem> => {
  try {
    const res = await axios.post("/cart", {
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to create cart item");
    }
    throw new Error("Failed to create cart item");
  }
};

export const updateCartItem = async (item: CartItem): Promise<CartItem> => {
  try {
    const res = await axios.put(`/cart/${item.id}`, {
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to update cart item");
    }
    throw new Error("Failed to update cart item");
  }
};

export const deleteCartItem = async (id: number): Promise<void> => {
  await axios.delete(`/cart/${id}`);
};

export const cartApi = {
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
