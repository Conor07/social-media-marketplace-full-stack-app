import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { ItemToSell } from "../../types";
import {
  getItemsToSell,
  createItemToSell,
  updateItemToSell,
  deleteItemToSell,
} from "../../api/itemsToSellApi";

export const fetchItemsToSellThunk = createAsyncThunk(
  "itemsToSell/fetchItemsToSell",
  async (_, { rejectWithValue }) => {
    try {
      const items = await getItemsToSell();
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createItemToSellThunk = createAsyncThunk(
  "itemsToSell/createItemToSell",
  async (item: ItemToSell, { rejectWithValue }) => {
    try {
      const newItem = await createItemToSell(item);
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateItemToSellThunk = createAsyncThunk(
  "itemsToSell/updateItemToSell",
  async (item: ItemToSell, { rejectWithValue }) => {
    try {
      const updated = await updateItemToSell(item);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteItemToSellThunk = createAsyncThunk(
  "itemsToSell/deleteItemToSell",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteItemToSell(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

interface ItemsToSellState {
  itemsToSell: ItemToSell[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: ItemsToSellState = {
  itemsToSell: [],
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
};

export const itemsSlice = createSlice({
  name: "itemsToSell",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchItemsToSellThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(
        fetchItemsToSellThunk.fulfilled,
        (state, action: PayloadAction<ItemToSell[]>) => {
          state.fetchStatus = "succeeded";
          state.itemsToSell = action.payload;
        },
      )
      .addCase(fetchItemsToSellThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload as string;
      })
      // Create
      .addCase(createItemToSellThunk.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(
        createItemToSellThunk.fulfilled,
        (state, action: PayloadAction<ItemToSell>) => {
          state.createStatus = "succeeded";
          state.itemsToSell.push(action.payload);
        },
      )
      .addCase(createItemToSellThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload as string;
      })
      // Update
      .addCase(updateItemToSellThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(
        updateItemToSellThunk.fulfilled,
        (state, action: PayloadAction<ItemToSell>) => {
          state.updateStatus = "succeeded";
          const idx = state.itemsToSell.findIndex(
            (i) => i.id === action.payload.id,
          );
          if (idx !== -1) state.itemsToSell[idx] = action.payload;
        },
      )
      .addCase(updateItemToSellThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      })
      // Delete
      .addCase(deleteItemToSellThunk.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(
        deleteItemToSellThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleteStatus = "succeeded";
          state.itemsToSell = state.itemsToSell.filter(
            (item) => item.id !== action.payload,
          );
        },
      )
      .addCase(deleteItemToSellThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload as string;
      });
  },
});

export const selectItemsToSell = (state: RootState) => state.itemsToSell;

export default itemsSlice.reducer;
