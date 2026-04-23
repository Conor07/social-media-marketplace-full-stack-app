import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { CartItem, PaginationMeta } from "../../types";
import {
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from "../../api/cartApi";

export const fetchCartItemsThunk = createAsyncThunk<any, number | undefined>(
  "cart/fetchCartItems",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getCartItems(page);
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch cart items";

      return rejectWithValue(message);
    }
  },
);

export const createCartItemThunk = createAsyncThunk(
  "cart/createCartItem",
  async (item: CartItem, { rejectWithValue }) => {
    try {
      const newItem = await createCartItem(item);

      return newItem;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create cart item";

      return rejectWithValue(message);
    }
  },
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async (item: CartItem, { rejectWithValue }) => {
    try {
      const updated = await updateCartItem(item);

      return updated;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update cart item";

      return rejectWithValue(message);
    }
  },
);

export const deleteCartItemThunk = createAsyncThunk(
  "cart/deleteCartItem",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCartItem(id);

      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete cart item";

      return rejectWithValue(message);
    }
  },
);

interface CartState {
  cartItems: CartItem[];
  pagination: PaginationMeta;
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

const initialState: CartState = {
  cartItems: [],
  pagination: initialPagination,
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemsThunk.pending, (state) => {
        state.fetchStatus = "loading";

        state.fetchError = null;
      })
      .addCase(
        fetchCartItemsThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.fetchStatus = "succeeded";

          state.cartItems = action.payload.data;
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(fetchCartItemsThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";

        state.fetchError = action.payload as string;
      })
      .addCase(createCartItemThunk.pending, (state) => {
        state.createStatus = "loading";

        state.createError = null;
      })
      .addCase(
        createCartItemThunk.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.createStatus = "succeeded";

          state.cartItems.push(action.payload);
        },
      )
      .addCase(createCartItemThunk.rejected, (state, action) => {
        state.createStatus = "failed";

        state.createError = action.payload as string;
      })
      .addCase(updateCartItemThunk.pending, (state) => {
        state.updateStatus = "loading";

        state.updateError = null;
      })
      .addCase(
        updateCartItemThunk.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.updateStatus = "succeeded";

          const idx = state.cartItems.findIndex(
            (i) => i.id === action.payload.id,
          );

          if (idx !== -1) state.cartItems[idx] = action.payload;
        },
      )
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.updateError = action.payload as string;
      })
      .addCase(deleteCartItemThunk.pending, (state) => {
        state.deleteStatus = "loading";

        state.deleteError = null;
      })
      .addCase(
        deleteCartItemThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleteStatus = "succeeded";

          state.cartItems = state.cartItems.filter(
            (item) => item.id !== action.payload,
          );
        },
      )
      .addCase(deleteCartItemThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.deleteError = action.payload as string;
      });
  },
});

export const selectCartItems = (state: RootState) => state.cart;

export const { setCurrentPage } = cartSlice.actions;

export default cartSlice.reducer;
