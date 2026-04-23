import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { ItemToSell, PaginationMeta } from "../../types";
import {
  getUserItemsToSell,
  getAllAvailableItemsToSell,
  createItemToSell,
  updateItemToSell,
  deleteItemToSell,
} from "../../api/itemsToSellApi";

export const fetchUserItemsToSellThunk = createAsyncThunk<
  any,
  number | undefined
>("itemsToSell/fetchUserItemsToSell", async (page = 1, { rejectWithValue }) => {
  try {
    const response = await getUserItemsToSell(page);
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user items";

    return rejectWithValue(message);
  }
});

export const fetchItemsToSellThunk = createAsyncThunk<any, number | undefined>(
  "itemsToSell/fetchItemsToSell",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getAllAvailableItemsToSell(page);
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch items";

      return rejectWithValue(message);
    }
  },
);

export const createItemToSellThunk = createAsyncThunk(
  "itemsToSell/createItemToSell",
  async (item: Omit<ItemToSell, "userId">, { rejectWithValue }) => {
    try {
      const newItem = await createItemToSell(item as ItemToSell);

      return newItem;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create item";

      return rejectWithValue(message);
    }
  },
);

export const updateItemToSellThunk = createAsyncThunk(
  "itemsToSell/updateItemToSell",
  async (item: Omit<ItemToSell, "userId">, { rejectWithValue }) => {
    try {
      const updated = await updateItemToSell(item as ItemToSell);

      return updated;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update item";

      return rejectWithValue(message);
    }
  },
);

export const deleteItemToSellThunk = createAsyncThunk(
  "itemsToSell/deleteItemToSell",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteItemToSell(id);

      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete item";

      return rejectWithValue(message);
    }
  },
);

interface ItemsToSellState {
  itemsToSell: ItemToSell[];
  userItemsPagination: PaginationMeta;
  availableItemsPagination: PaginationMeta;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialState: ItemsToSellState = {
  itemsToSell: [],
  userItemsPagination: initialPagination,
  availableItemsPagination: initialPagination,
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
  reducers: {
    setUserItemsPage: (state, action: PayloadAction<number>) => {
      state.userItemsPagination.page = action.payload;
    },
    setAvailableItemsPage: (state, action: PayloadAction<number>) => {
      state.availableItemsPagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserItemsToSellThunk.pending, (state) => {
        state.fetchStatus = "loading";

        state.fetchError = null;
      })
      .addCase(
        fetchUserItemsToSellThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.fetchStatus = "succeeded";

          state.itemsToSell = action.payload.data;

          state.userItemsPagination = action.payload.pagination;
        },
      )
      .addCase(fetchUserItemsToSellThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";

        state.fetchError = action.payload as string;
      })
      .addCase(fetchItemsToSellThunk.pending, (state) => {
        state.fetchStatus = "loading";

        state.fetchError = null;
      })
      .addCase(
        fetchItemsToSellThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.fetchStatus = "succeeded";

          state.itemsToSell = action.payload.data;

          state.availableItemsPagination = action.payload.pagination;
        },
      )
      .addCase(fetchItemsToSellThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";

        state.fetchError = action.payload as string;
      })
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

export const { setUserItemsPage, setAvailableItemsPage } = itemsSlice.actions;

export default itemsSlice.reducer;
