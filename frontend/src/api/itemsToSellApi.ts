import axios from "axios";
import type { ItemToSell, PaginatedResponse } from "../types";

export const getUserItemsToSell = async (
  page: number = 1,
): Promise<PaginatedResponse<ItemToSell>> => {
  const res = await axios.get(`/itemsToSell?page=${page}`);

  return res.data;
};

export const getAllAvailableItemsToSell = async (
  page: number = 1,
): Promise<PaginatedResponse<ItemToSell>> => {
  const res = await axios.get(`/itemsToSell/available/all?page=${page}`);

  return res.data;
};

export const createItemToSell = async (
  item: ItemToSell,
): Promise<ItemToSell> => {
  try {
    const res = await axios.post("/itemsToSell", {
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to create item");
    }

    throw new Error("Failed to create item");
  }
};

export const updateItemToSell = async (
  item: ItemToSell,
): Promise<ItemToSell> => {
  try {
    const res = await axios.put(`/itemsToSell/${item.id}`, {
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to update item");
    }

    throw new Error("Failed to update item");
  }
};

export const deleteItemToSell = async (id: number): Promise<void> => {
  await axios.delete(`/itemsToSell/${id}`);
};

export const itemsToSellApi = {
  getUserItemsToSell,
  getAllAvailableItemsToSell,
  createItemToSell,
  updateItemToSell,
  deleteItemToSell,
};
