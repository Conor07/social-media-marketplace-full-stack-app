import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsState {
  posts: Post[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: "Welcome to the Social Media Marketplace!",
    content:
      "This is a place where you can buy and sell items with your friends. Start by creating a post to sell something or browse the marketplace to find great deals!",
  },
];

const initialState: PostsState = {
  posts: INITIAL_POSTS,
};

export const postsSlice = createSlice({
  name: "posts",

  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { addPost, removePost } = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;
