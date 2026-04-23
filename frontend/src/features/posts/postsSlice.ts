import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Post, PaginationMeta } from "../../types";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../../api/postsApi";

export const fetchPostsThunk = createAsyncThunk<any, number | undefined>(
  "posts/fetchPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getPosts(page);
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch posts";

      return rejectWithValue(message);
    }
  },
);

export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async (post: Omit<Post, "userId" | "likes">, { rejectWithValue }) => {
    try {
      const newPost = await createPost(post as Post);

      return newPost;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create post";

      return rejectWithValue(message);
    }
  },
);

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (post: Omit<Post, "userId" | "likes">, { rejectWithValue }) => {
    try {
      const updated = await updatePost(post as Post);

      return updated;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update post";

      return rejectWithValue(message);
    }
  },
);

export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id: number, { rejectWithValue }) => {
    try {
      await deletePost(id);

      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete post";

      return rejectWithValue(message);
    }
  },
);

export const likePostThunk = createAsyncThunk(
  "posts/likePost",
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await likePost(id);

      return { id, ...result };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to like/unlike post";

      return rejectWithValue(message);
    }
  },
);

interface PostsState {
  posts: Post[];
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

const initialState: PostsState = {
  posts: [],
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

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsThunk.pending, (state) => {
        state.fetchStatus = "loading";

        state.fetchError = null;
      })
      .addCase(
        fetchPostsThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.fetchStatus = "succeeded";

          state.posts = action.payload.data;

          state.pagination = action.payload.pagination;
        },
      )
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";

        state.fetchError = action.payload as string;
      })
      .addCase(createPostThunk.pending, (state) => {
        state.createStatus = "loading";

        state.createError = null;
      })
      .addCase(
        createPostThunk.fulfilled,
        (state, action: PayloadAction<Post>) => {
          state.createStatus = "succeeded";

          state.posts.push(action.payload);
        },
      )
      .addCase(createPostThunk.rejected, (state, action) => {
        state.createStatus = "failed";

        state.createError = action.payload as string;
      })
      .addCase(updatePostThunk.pending, (state) => {
        state.updateStatus = "loading";

        state.updateError = null;
      })
      .addCase(
        updatePostThunk.fulfilled,
        (state, action: PayloadAction<Post>) => {
          state.updateStatus = "succeeded";

          const idx = state.posts.findIndex((p) => p.id === action.payload.id);

          if (idx !== -1) state.posts[idx] = action.payload;
        },
      )
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.updateError = action.payload as string;
      })
      .addCase(deletePostThunk.pending, (state) => {
        state.deleteStatus = "loading";

        state.deleteError = null;
      })
      .addCase(
        deletePostThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleteStatus = "succeeded";

          state.posts = state.posts.filter(
            (post) => post.id !== action.payload,
          );
        },
      )
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.deleteError = action.payload as string;
      })
      .addCase(likePostThunk.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          const userId = JSON.parse(
            localStorage.getItem("user") || "{}",
          ).userId;

          if (action.payload.liked) {
            if (!state.posts[idx].likes.includes(userId)) {
              state.posts[idx].likes.push(userId);
            }
          } else {
            state.posts[idx].likes = state.posts[idx].likes.filter(
              (uid) => uid !== userId,
            );
          }
        }
      });
  },
});

export const selectPosts = (state: RootState) => state.posts;

export const { setCurrentPage } = postsSlice.actions;

export default postsSlice.reducer;
