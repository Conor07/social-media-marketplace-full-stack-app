import type { CartItem } from "../types";

export const getCartItems = async (): Promise<CartItem[]> => {
  const response = await fetch("/api/cart");
  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }
  return response.json();
};

export const createCartItem = async (item: CartItem): Promise<CartItem> => {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    }),
  });

  if (
    response.status === 400 &&
    response.headers.get("Content-Type")?.includes("application/json")
  ) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  if (!response.ok) {
    throw new Error("Failed to create cart item");
  }

  return response.json();
};

export const updateCartItem = async (item: CartItem): Promise<CartItem> => {
  const response = await fetch(`/api/cart/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    }),
  });

  if (
    response.status === 400 &&
    response.headers.get("Content-Type")?.includes("application/json")
  ) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }
  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return response.json();
};

export const deleteCartItem = async (id: number): Promise<void> => {
  const response = await fetch(`/api/cart/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete cart item");
  }
};

export const cartApi = {
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
