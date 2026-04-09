import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface ItemToSell {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ItemsToSellState {
  itemsToSell: ItemToSell[];
}

const initialState: ItemsToSellState = {
  itemsToSell: [],
};

export const itemsSlice = createSlice({
  name: "itemsToSell",

  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemToSell>) => {
      state.itemsToSell.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.itemsToSell = state.itemsToSell.filter(
        (item) => item.id !== action.payload,
      );
    },
    updateItem: (
      state,
      action: PayloadAction<{
        id: number;
        name?: string;
        price?: number;
        quantity?: number;
      }>,
    ) => {
      const item = state.itemsToSell.find(
        (item) => item.id === action.payload.id,
      );
      if (item) {
        if (action.payload.name !== undefined) {
          item.name = action.payload.name;
        }
        if (action.payload.price !== undefined) {
          item.price = action.payload.price;
        }
        if (action.payload.quantity !== undefined) {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearItems: (state) => {
      state.itemsToSell = [];
    },
  },
});

export const { addItem, removeItem, updateItem, clearItems } =
  itemsSlice.actions;

export const selectItemsToSell = (state: RootState) => state.itemsToSell;

export default itemsSlice.reducer;
