import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Post } from "../../types";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../../api/postsApi";

export const fetchPostsThunk = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const posts = await getPosts();

      return posts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async (post: Post, { rejectWithValue }) => {
    try {
      const newPost = await createPost(post);

      return newPost;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (post: Post, { rejectWithValue }) => {
    try {
      const updated = await updatePost(post);

      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id: number, { rejectWithValue }) => {
    try {
      await deletePost(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

interface PostsState {
  posts: Post[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: PostsState = {
  posts: [],
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPostsThunk.pending, (state) => {
        state.fetchStatus = "loading";

        state.fetchError = null;
      })
      .addCase(
        fetchPostsThunk.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.fetchStatus = "succeeded";

          state.posts = action.payload;
        },
      )
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";

        state.fetchError = action.payload as string;
      })
      // Create post
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
      // Update post
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
      // Delete post
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
      });
  },
});

export const selectPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;
