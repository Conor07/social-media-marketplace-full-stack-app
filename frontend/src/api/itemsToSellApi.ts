import type { ItemToSell } from "../types";

export const getItemsToSell = async (): Promise<ItemToSell[]> => {
  const response = await fetch("/api/itemsToSell");

  if (!response.ok) {
    throw new Error("Failed to fetch items to sell");
  }
  return response.json();
};

export const createItemToSell = async (
  item: ItemToSell,
): Promise<ItemToSell> => {
  const response = await fetch("/api/itemsToSell", {
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
    throw new Error("Failed to create item");
  }

  return response.json();
};

export const updateItemToSell = async (
  item: ItemToSell,
): Promise<ItemToSell> => {
  const response = await fetch(`/api/itemsToSell/${item.id}`, {
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
    throw new Error("Failed to update item");
  }

  return response.json();
};

export const deleteItemToSell = async (id: number): Promise<void> => {
  const response = await fetch(`/api/itemsToSell/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

export const itemsToSellApi = {
  getItemsToSell,
  createItemToSell,
  updateItemToSell,
  deleteItemToSell,
};
